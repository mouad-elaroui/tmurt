/**
 * Debug Inventory Linkage
 * Check the inventory setup for new products
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function debugInventory({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const inventoryModuleService = container.resolve(Modules.INVENTORY);
    const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);

    logger.info("🔍 Debugging inventory setup...");

    // Get stock locations
    const stockLocations = await stockLocationModuleService.listStockLocations({});
    logger.info(`\nStock Locations: ${stockLocations.length}`);
    for (const sl of stockLocations) {
        logger.info(`  - ${sl.id}: ${sl.name}`);
    }

    // Get products with variants
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "handle",
            "variants.id",
            "variants.title",
            "variants.sku",
            "variants.inventory_items.inventory_item_id",
            "variants.inventory_items.inventory.id",
            "variants.inventory_items.inventory.sku",
        ],
    });

    logger.info(`\nProducts: ${products.length}`);

    for (const product of products.slice(0, 3)) { // Check first 3
        logger.info(`\n📦 ${product.title} (${product.handle})`);

        for (const variant of product.variants || []) {
            logger.info(`  Variant: ${variant.title} (${variant.id})`);
            logger.info(`    SKU: ${variant.sku}`);

            const inventoryItems = variant.inventory_items || [];
            logger.info(`    Inventory Items linked: ${inventoryItems.length}`);

            for (const ii of inventoryItems) {
                logger.info(`      - inventory_item_id: ${ii.inventory_item_id}`);
                if (ii.inventory) {
                    logger.info(`        inventory: ${ii.inventory.id}, sku: ${ii.inventory.sku}`);
                }
            }
        }
    }

    // Check inventory levels for one of our products
    logger.info("\n\n🔍 Checking inventory levels for new product variants...");

    const newProductHandles = ["emerald-velvet-kaftan", "burgundy-silk-kaftan"];
    const newProducts = products.filter((p: any) => newProductHandles.includes(p.handle));

    for (const product of newProducts) {
        logger.info(`\n📦 ${product.title}`);
        for (const variant of product.variants || []) {
            const inventoryItemLinks = variant.inventory_items || [];
            if (inventoryItemLinks.length === 0) {
                logger.warn(`  ⚠️ Variant ${variant.title} has NO inventory items linked!`);
            } else {
                for (const ii of inventoryItemLinks) {
                    const levels = await inventoryModuleService.listInventoryLevels({
                        inventory_item_id: ii.inventory_item_id,
                    });
                    logger.info(`  Variant ${variant.title}: ${levels.length} inventory levels`);
                    for (const level of levels) {
                        logger.info(`    Location ${level.location_id}: ${level.stocked_quantity} stocked, ${level.reserved_quantity || 0} reserved`);
                    }
                }
            }
        }
    }
}
