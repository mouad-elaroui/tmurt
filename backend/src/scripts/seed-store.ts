// setup store Tmurt: Morocco region, MAD currency, fulfillment, shipping

import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
    createRegionsWorkflow,
    createShippingOptionsWorkflow,
    createTaxRegionsWorkflow,
    updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

interface Price {
    currency_code: string
    amount: number
}

interface PriceSet {
    id: string
    prices: Price[]
}

interface VariantWithPriceSet {
    id: string
    title: string
    sku?: string
    price_set?: PriceSet
}

interface ProductWithVariants {
    id: string
    title: string
    handle: string
    variants?: VariantWithPriceSet[]
}

interface GeoZone {
    id: string
    country_code: string
}

interface ServiceZone {
    id: string
    name: string
    geo_zones?: GeoZone[]
}

export default async function seedStore({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const storeModuleService = container.resolve(Modules.STORE)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
    const pricingModuleService = container.resolve(Modules.PRICING)
    const apiKeyService = container.resolve(Modules.API_KEY)
    const scService = container.resolve(Modules.SALES_CHANNEL)

    logger.info("=== TMURT STORE SETUP ===\n")

    // ========== 1. STORE NAME ==========
    const [store] = await storeModuleService.listStores()
    await storeModuleService.updateStores(store.id, { name: "Tmurt" })
    logger.info("[OK] Store name: Tmurt")

    // ========== 2. MAD CURRENCY ==========
    await updateStoresWorkflow(container).run({
        input: {
            selector: { id: store.id },
            update: {
                supported_currencies: [
                    { currency_code: "eur", is_default: false },
                    { currency_code: "usd", is_default: false },
                    { currency_code: "mad", is_default: true },
                ],
            },
        },
    })
    logger.info("[OK] MAD currency default")

    // ========== 3. MOROCCO REGION ==========
    let moroccoRegion
    try {
        const { result } = await createRegionsWorkflow(container).run({
            input: {
                regions: [{
                    name: "Morocco",
                    currency_code: "mad",
                    countries: ["ma"],
                    payment_providers: ["pp_system_default"],
                }],
            },
        })
        moroccoRegion = result[0]
        logger.info(`[OK] Morocco region: ${moroccoRegion.id}`)
    } catch {
        logger.info("[SKIP] Morocco region deja kayn")
    }

    // ========== 4. TAX REGION ==========
    try {
        await createTaxRegionsWorkflow(container).run({
            input: [{ country_code: "ma", provider_id: "tp_system" }],
        })
        logger.info("[OK] Tax region MA")
    } catch {
        logger.info("[SKIP] Tax region deja kayn")
    }

    // ========== 5. STOCK LOCATION ==========
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
    let stockLocations = await stockLocationService.listStockLocations({})

    if (!stockLocations.length) {
        const warehouse = await stockLocationService.createStockLocations({
            name: "Morocco Warehouse - Casablanca",
            address: {
                city: "Casablanca",
                country_code: "MA",
                address_1: "Boulevard Mohammed V",
            },
        })
        await link.create({
            [Modules.STOCK_LOCATION]: { stock_location_id: warehouse.id },
            [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
        })
        stockLocations = [warehouse]
        logger.info("[OK] Warehouse Casablanca")
    } else {
        logger.info("[SKIP] Warehouse deja kayn")
    }

    // ========== 6. FULFILLMENT ==========
    const { data: zones } = await query.graph({
        entity: "service_zone",
        fields: ["id", "name", "geo_zones.*"],
    }) as { data: ServiceZone[] }

    const moroccoZone = zones.find(z => z.geo_zones?.some(g => g.country_code === "ma"))

    if (!moroccoZone) {
        const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" })
        if (!shippingProfiles.length) {
            logger.error("Ma kaynch shipping profile!")
            return
        }

        const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
            name: "Morocco Delivery",
            type: "shipping",
            service_zones: [{
                name: "Morocco",
                geo_zones: [{ country_code: "ma", type: "country" }],
            }],
        })

        await link.create({
            [Modules.STOCK_LOCATION]: { stock_location_id: stockLocations[0].id },
            [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
        })

        if (moroccoRegion) {
            await createShippingOptionsWorkflow(container).run({
                input: [
                    {
                        name: "Livraison Standard",
                        price_type: "flat",
                        provider_id: "manual_manual",
                        service_zone_id: fulfillmentSet.service_zones[0].id,
                        shipping_profile_id: shippingProfiles[0].id,
                        type: { label: "Standard", description: "3-5 jours", code: "standard-ma" },
                        prices: [
                            { currency_code: "mad", amount: 30 },
                            { region_id: moroccoRegion.id, amount: 30 },
                        ],
                        rules: [
                            { attribute: "enabled_in_store", value: "true", operator: "eq" },
                            { attribute: "is_return", value: "false", operator: "eq" },
                        ],
                    },
                    {
                        name: "Livraison Express",
                        price_type: "flat",
                        provider_id: "manual_manual",
                        service_zone_id: fulfillmentSet.service_zones[0].id,
                        shipping_profile_id: shippingProfiles[0].id,
                        type: { label: "Express", description: "24h", code: "express-ma" },
                        prices: [
                            { currency_code: "mad", amount: 60 },
                            { region_id: moroccoRegion.id, amount: 60 },
                        ],
                        rules: [
                            { attribute: "enabled_in_store", value: "true", operator: "eq" },
                            { attribute: "is_return", value: "false", operator: "eq" },
                        ],
                    },
                ],
            })
        }
        logger.info("[OK] Fulfillment + Shipping options")
    } else {
        logger.info("[SKIP] Morocco fulfillment deja kayn")
    }

    // ========== 7. API KEY + SALES CHANNEL ==========
    const scs = await scService.listSalesChannels({}, { take: 1 })
    if (scs.length) {
        const keys = await apiKeyService.listApiKeys({ type: "publishable" }, { take: 1 })
        if (keys.length) {
            logger.info(`[OK] Found API Key: ${keys[0].id} and Sales Channel: ${scs[0].id}`)
        }
    }

    // ========== 8. MAD PRICES ==========
    logger.info("\nAdding MAD prices...")

    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id", "title", "handle",
            "variants.id", "variants.title", "variants.sku",
            "variants.price_set.id", "variants.price_set.prices.*",
        ],
    }) as { data: ProductWithVariants[] }

    let added = 0
    for (const product of products) {
        for (const variant of product.variants ?? []) {
            const priceSet = variant.price_set
            if (!priceSet?.id) continue

            const prices = priceSet.prices ?? []
            const eurPrice = prices.find(p => p.currency_code === "eur")
            const madPrice = prices.find(p => p.currency_code === "mad")

            if (madPrice || !eurPrice) continue

            const madAmount = Math.ceil((eurPrice.amount * 10.5) / 50) * 50

            try {
                await pricingModuleService.addPrices({
                    priceSetId: priceSet.id,
                    prices: [{ currency_code: "mad", amount: madAmount }],
                })
                added++
            } catch { /* skip */ }
        }
    }
    logger.info(`[OK] Added ${added} MAD prices`)

    logger.info("\n=== STORE SETUP DONE ===")
}
