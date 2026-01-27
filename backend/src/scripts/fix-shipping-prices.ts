// Script to fix shipping options without prices
// Run with: bun run medusa exec ./src/scripts/fix-shipping-prices.ts

import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixShippingPrices({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)
    const pricingService = container.resolve(Modules.PRICING)
    const regionService = container.resolve(Modules.REGION)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    logger.info("=== FIXING SHIPPING OPTION PRICES ===\n")

    // Get Morocco region
    const regions = await regionService.listRegions({})
    const moroccoRegion = regions.find((r: { currency_code: string }) => r.currency_code === "mad")

    if (!moroccoRegion) {
        logger.error("Ma kaynch Morocco region! Run seed:store first.")
        return
    }
    logger.info(`Morocco region: ${moroccoRegion.id} (${moroccoRegion.name})`)

    // Get all shipping options
    const shippingOptions = await fulfillmentService.listShippingOptions({})
    logger.info(`Found ${shippingOptions.length} shipping options`)

    let fixed = 0
    for (const option of shippingOptions) {
        logger.info(`\nChecking: ${option.name} (${option.id})`)

        try {
            // Get the price set linked to this shipping option
            const links = await link.list({
                shipping_option_id: option.id,
            })

            // Find price_set link
            const priceSetLink = links.find((l: Record<string, string>) => l.price_set_id)

            if (!priceSetLink?.price_set_id) {
                logger.warn(`  -> No price set linked`)
                continue
            }

            const priceSetId = priceSetLink.price_set_id
            logger.info(`  -> Price set: ${priceSetId}`)

            // Get current prices
            const priceSets = await pricingService.listPriceSets({ id: [priceSetId] }, { relations: ["prices"] })

            if (!priceSets.length) {
                logger.warn(`  -> Price set not found`)
                continue
            }

            const priceSet = priceSets[0]
            const prices = priceSet.prices || []

            const hasMADPrice = prices.some((p: { currency_code: string }) => p.currency_code === "mad")
            const hasRegionPrice = prices.some((p: { rules?: Array<{ value: string }> }) =>
                p.rules?.some(r => r.value === moroccoRegion.id)
            )

            if (!hasMADPrice) {
                // Get base price (EUR or first available)
                const eurPrice = prices.find((p: { currency_code: string }) => p.currency_code === "eur")
                const baseAmount = eurPrice?.amount || prices[0]?.amount || 50
                const madAmount = Math.ceil((Number(baseAmount) * 10.5) / 10) * 10

                await pricingService.addPrices({
                    priceSetId: priceSetId,
                    prices: [
                        { currency_code: "mad", amount: madAmount },
                    ],
                })
                fixed++
                logger.info(`  -> ADDED MAD price: ${madAmount}`)
            } else {
                logger.info(`  -> Already has MAD price`)
            }

        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error)
            logger.error(`  -> Error: ${msg}`)
        }
    }

    logger.info(`\n=== FIXED ${fixed} SHIPPING OPTIONS ===`)
}
