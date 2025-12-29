/**
 * Add Morocco to Fulfillment Service Zone
 * This fixes the "Out of stock" issue for Morocco region
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function addMoroccoToFulfillment({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

    logger.info("🇲🇦 Adding Morocco to fulfillment service zone...\n");

    // Get all service zones
    const { data: zones } = await query.graph({
        entity: "service_zone",
        fields: ["id", "name", "geo_zones.*", "fulfillment_set_id"],
    });

    logger.info(`Found ${zones.length} service zones`);

    for (const zone of zones) {
        const geoZones = zone.geo_zones || [];
        const countries = geoZones.map((g: any) => g.country_code);
        logger.info(`\n📍 ${zone.name} (${zone.id})`);
        logger.info(`   Current countries: ${countries.join(", ")}`);

        // Check if Morocco is already included
        if (countries.includes("ma")) {
            logger.info("   ✅ Morocco already included!");
            continue;
        }

        // Add Morocco geo zone to this service zone
        logger.info("   ➕ Adding Morocco...");

        try {
            // Create a new geo zone for Morocco
            const updated = await fulfillmentModuleService.createGeoZones({
                service_zone_id: zone.id,
                country_code: "ma",
                type: "country",
            });

            logger.info(`   ✅ Added Morocco! New geo zone: ${updated.id}`);
        } catch (e: any) {
            logger.error(`   ❌ Error: ${e.message}`);
        }
    }

    logger.info("\n✅ Morocco fulfillment setup complete!");
}
