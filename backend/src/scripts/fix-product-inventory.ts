/**
 * Script bash n-riglo stock dyal les produits
 * Kazid stock l ga3 les produits bash ibano "in stock"
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function fixProductInventory({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const inventoryModuleService = container.resolve(Modules.INVENTORY);
    const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);

    logger.info("📦 Fixing product inventory...");

    // Njibo fin kayn stock
    const stockLocations = await stockLocationModuleService.listStockLocations({});
    if (!stockLocations.length) {
        logger.error("No stock location found");
        return;
    }
    const stockLocation = stockLocations[0];
    logger.info(`Stock Location: ${stockLocation.name} (${stockLocation.id})`);

    // Njibo ga3 inventory items
    const inventoryItems = await inventoryModuleService.listInventoryItems({});
    logger.info(`Found ${inventoryItems.length} inventory items`);

    // Njibo levels dyal stock
    for (const item of inventoryItems) {
        const levels = await inventoryModuleService.listInventoryLevels({
            inventory_item_id: item.id,
        });

        let locationLevel = levels.find(l => l.location_id === stockLocation.id);

        if (!locationLevel) {
            // N-sowbo level jdid
            logger.info(`Creating inventory level for item ${item.id}...`);
            locationLevel = await inventoryModuleService.createInventoryLevels({
                inventory_item_id: item.id,
                location_id: stockLocation.id,
                stocked_quantity: 100,
            });
            logger.info(`  ✅ Created with 100 stock`);
        } else if (locationLevel.stocked_quantity === 0) {
            // N-updaiw level li deja kayn
            logger.info(`Updating inventory level for item ${item.id}...`);
            await inventoryModuleService.updateInventoryLevels(locationLevel.id, {
                stocked_quantity: 100,
            });
            logger.info(`  ✅ Updated to 100 stock`);
        } else {
            logger.info(`  ⏭️  Item ${item.id} already has ${locationLevel.stocked_quantity} stock`);
        }
    }

    logger.info("\n✅ Inventory fix complete! All products should now show as in stock.");
}
