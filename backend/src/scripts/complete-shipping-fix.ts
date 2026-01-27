// Complete fix for shipping options - ensures Morocco has shipping with prices
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function completeShippingFix({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)
    const regionService = container.resolve(Modules.REGION)
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION)

    logger.info("=== COMPLETE SHIPPING FIX ===\n")

    // 1. Get Morocco region
    const regions = await regionService.listRegions({})
    const moroccoRegion = regions.find((r: { currency_code: string }) => r.currency_code === "mad")

    if (!moroccoRegion) {
        logger.error("Morocco region not found! Run seed:store first")
        return
    }
    logger.info(`Morocco region: ${moroccoRegion.id}`)

    // 2. Get shipping profile
    const shippingProfiles = await fulfillmentService.listShippingProfiles({ type: "default" })
    if (!shippingProfiles.length) {
        logger.error("No shipping profile found!")
        return
    }
    const shippingProfile = shippingProfiles[0]
    logger.info(`Shipping profile: ${shippingProfile.id}`)

    // 3. Get stock location
    const stockLocations = await stockLocationService.listStockLocations({})
    if (!stockLocations.length) {
        logger.error("No stock location found!")
        return
    }
    const stockLocation = stockLocations[0]
    logger.info(`Stock location: ${stockLocation.id}`)

    // 4. Check for Morocco service zone
    const { data: zones } = await query.graph({
        entity: "service_zone",
        fields: ["id", "name", "geo_zones.country_code", "fulfillment_set_id"],
    }) as { data: Array<{ id: string; name: string; fulfillment_set_id?: string; geo_zones?: Array<{ country_code: string }> }> }

    let moroccoZone = zones.find(z => z.geo_zones?.some(g => g.country_code === "ma"))

    if (!moroccoZone) {
        logger.info("Creating Morocco fulfillment set and service zone...")

        const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
            name: "Morocco Delivery",
            type: "shipping",
            service_zones: [{
                name: "Morocco",
                geo_zones: [{ country_code: "ma", type: "country" }],
            }],
        })

        await link.create({
            [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
            [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
        })

        moroccoZone = fulfillmentSet.service_zones[0]
        logger.info(`Created Morocco zone: ${moroccoZone.id}`)
    } else {
        logger.info(`Morocco zone exists: ${moroccoZone.id}`)
    }

    // 5. Check existing shipping options for Morocco zone
    const existingOptions = await fulfillmentService.listShippingOptions({
        service_zone_id: moroccoZone.id,
    })

    if (existingOptions.length > 0) {
        logger.info(`Found ${existingOptions.length} existing options for Morocco zone`)
        // Delete them to recreate with proper prices
        for (const opt of existingOptions) {
            try {
                await fulfillmentService.deleteShippingOptions([opt.id])
                logger.info(`Deleted: ${opt.name}`)
            } catch (e) {
                logger.warn(`Could not delete ${opt.name}`)
            }
        }
    }

    // 6. Create new shipping options with MAD prices
    logger.info("\nCreating shipping options with MAD prices...")

    try {
        await createShippingOptionsWorkflow(container).run({
            input: [
                {
                    name: "Livraison Standard",
                    price_type: "flat",
                    provider_id: "manual_manual",
                    service_zone_id: moroccoZone.id,
                    shipping_profile_id: shippingProfile.id,
                    type: { label: "Standard", description: "3-5 jours ouvrables", code: "standard-ma" },
                    prices: [
                        { currency_code: "mad", amount: 35 }, // 35 MAD
                        { region_id: moroccoRegion.id, amount: 35 },
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
                    service_zone_id: moroccoZone.id,
                    shipping_profile_id: shippingProfile.id,
                    type: { label: "Express", description: "Livraison en 24h", code: "express-ma" },
                    prices: [
                        { currency_code: "mad", amount: 65 }, // 65 MAD
                        { region_id: moroccoRegion.id, amount: 65 },
                    ],
                    rules: [
                        { attribute: "enabled_in_store", value: "true", operator: "eq" },
                        { attribute: "is_return", value: "false", operator: "eq" },
                    ],
                },
            ],
        })
        logger.info("Created Livraison Standard (30 MAD)")
        logger.info("Created Livraison Express (60 MAD)")
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error)
        logger.error(`Error creating shipping options: ${msg}`)
    }

    logger.info("\n=== SHIPPING FIX COMPLETE ===")
}
