/**
 * Debug and Fix Region Fulfillment Setup
 * Check if stock location is linked to fulfillment provider for Morocco region
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function debugRegionFulfillment({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    logger.info("🔍 Debugging region/fulfillment setup...\n");

    // Get regions
    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name", "countries.*"],
    });

    logger.info(`Regions: ${regions.length}`);
    for (const region of regions) {
        const countryList = (region.countries || []).map((c: any) => c.iso_2).join(", ");
        logger.info(`  - ${region.id}: ${region.name} (countries: ${countryList})`);
    }

    // Get fulfillment providers
    const providers = await fulfillmentModuleService.listFulfillmentProviders({});
    logger.info(`\nFulfillment Providers: ${providers.length}`);
    for (const p of providers) {
        logger.info(`  - ${p.id}`);
    }

    // Get stock locations with fulfillment sets
    const stockLocations = await stockLocationModuleService.listStockLocations({});
    logger.info(`\nStock Locations: ${stockLocations.length}`);

    for (const sl of stockLocations) {
        logger.info(`  - ${sl.id}: ${sl.name}`);

        // Check fulfillment sets for this stock location
        const { data: slFulfillment } = await query.graph({
            entity: "stock_location",
            fields: ["id", "fulfillment_sets.id", "fulfillment_sets.name"],
            filters: { id: sl.id },
        });

        const fulfillmentSets = slFulfillment[0]?.fulfillment_sets || [];
        logger.info(`    Fulfillment Sets: ${fulfillmentSets.length}`);
        for (const fs of fulfillmentSets) {
            logger.info(`      - ${fs.id}: ${fs.name}`);
        }
    }

    // Get fulfillment sets with service zones
    const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({});
    logger.info(`\nAll Fulfillment Sets: ${fulfillmentSets.length}`);

    for (const fs of fulfillmentSets) {
        logger.info(`  - ${fs.id}: ${fs.name}, type: ${fs.type}`);

        // Get service zones
        const { data: fsData } = await query.graph({
            entity: "fulfillment_set",
            fields: ["id", "service_zones.id", "service_zones.name", "service_zones.geo_zones.*"],
            filters: { id: fs.id },
        });

        const zones = fsData[0]?.service_zones || [];
        logger.info(`    Service Zones: ${zones.length}`);
        for (const zone of zones) {
            const geoZones = zone.geo_zones || [];
            const countries = geoZones.map((g: any) => g.country_code).join(", ");
            logger.info(`      - ${zone.id}: ${zone.name} (countries: ${countries})`);
        }
    }

    logger.info("\n✅ Debug complete.");
}
