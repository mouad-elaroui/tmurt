// Debug script to see shipping options and their prices
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function debugShipping({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)
    const regionService = container.resolve(Modules.REGION)

    logger.info("=== DEBUG SHIPPING OPTIONS ===\n")

    // Get regions
    const regions = await regionService.listRegions({})
    logger.info("REGIONS:")
    for (const r of regions) {
        logger.info(`  - ${r.name}: ${r.currency_code} (${r.id})`)
    }

    // Get shipping options
    const options = await fulfillmentService.listShippingOptions({})
    logger.info(`\nSHIPPING OPTIONS (${options.length}):`)

    for (const opt of options) {
        logger.info(`\n  ${opt.name} (${opt.id})`)
        logger.info(`    price_type: ${opt.price_type}`)
        logger.info(`    provider_id: ${opt.provider_id}`)
        logger.info(`    service_zone_id: ${opt.service_zone_id}`)

        // Try to get calculated prices
        try {
            const { data } = await query.graph({
                entity: "shipping_option",
                filters: { id: opt.id },
                fields: ["id", "name", "calculated_price.*"],
            })
            if (data?.[0]?.calculated_price) {
                logger.info(`    calculated_price: ${JSON.stringify(data[0].calculated_price)}`)
            }
        } catch (e) {
            // Ignore
        }
    }

    // Get service zones
    const { data: zones } = await query.graph({
        entity: "service_zone",
        fields: ["id", "name", "geo_zones.country_code"],
    })

    logger.info("\nSERVICE ZONES:")
    for (const z of zones as Array<{ id: string; name: string; geo_zones?: Array<{ country_code: string }> }>) {
        const countries = z.geo_zones?.map(g => g.country_code).join(", ") || "none"
        logger.info(`  - ${z.name}: ${countries} (${z.id})`)
    }

    logger.info("\n=== END DEBUG ===")
}
