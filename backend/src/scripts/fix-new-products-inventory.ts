/**
 * N-qado stock dyal les produits l-jdad
 * N-rabto inventory items 3a variants w n-setiw quantity
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function fixNewProductsInventory({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const inventoryService = container.resolve(Modules.INVENTORY);
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION);
    const link = container.resolve(ContainerRegistrationKeys.LINK);

    logger.info("📦 Fixing inventory for new products...\n");

    // Handles dyal produits l-jdad li khasshom fix
    const newProductHandles = [
        "emerald-velvet-kaftan",
        "burgundy-silk-kaftan",
        "cream-cotton-djellaba",
        "navy-wool-djellaba",
        "golden-bridal-takchita",
        "white-cotton-jabador",
    ];

    // Njibo fin kayn stock
    const stockLocations = await stockLocationService.listStockLocations({});
    if (!stockLocations.length) {
        logger.error("No stock location found!");
        return;
    }
    const stockLocation = stockLocations[0];
    logger.info(`Stock Location: ${stockLocation.name} (${stockLocation.id})`);

    // Njibo les produits b l-variants dialhom w n-checkiw l-liaison m3a stock
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "handle",
            "variants.id",
            "variants.title",
            "variants.sku",
            "variants.inventory.id",
            "variants.inventory.stocked_quantity",
        ],
        filters: {
            handle: newProductHandles,
        },
    });

    logger.info(`Found ${products.length} new products\n`);

    let linkedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
        logger.info(`📦 ${product.title}`);

        for (const variant of product.variants || []) {
            // N-choufo wach l-variant deja 3endo inventory
            if (variant.inventory && variant.inventory.length > 0) {
                logger.info(`  ✅ ${variant.title}: already linked`);
                skippedCount++;
                continue;
            }

            logger.info(`  🔗 ${variant.title}: linking inventory...`);

            try {
                // N-sowbo inventory item jdid
                const inventoryItem = await inventoryService.createInventoryItems({
                    sku: variant.sku || `${product.handle}-${variant.id}`,
                    title: variant.title,
                });

                // N-rabto l-variant m3a inventory item
                await link.create({
                    [Modules.PRODUCT]: {
                        variant_id: variant.id,
                    },
                    [Modules.INVENTORY]: {
                        inventory_item_id: inventoryItem.id,
                    },
                });

                // N-setiw level dyal stock (chhal kayn)
                await inventoryService.createInventoryLevels({
                    inventory_item_id: inventoryItem.id,
                    location_id: stockLocation.id,
                    stocked_quantity: 100,
                });

                logger.info(`     ✅ Created inventory (100 units)`);
                linkedCount++;
            } catch (err: any) {
                logger.error(`     ❌ Error: ${err.message}`);
            }
        }
    }

    logger.info("\n═══════════════════════════════════════");
    logger.info("📊 SUMMARY");
    logger.info("═══════════════════════════════════════");
    logger.info(`🔗 Linked: ${linkedCount} variants`);
    logger.info(`⏭️  Skipped: ${skippedCount} (already linked)`);
    logger.info("\n✅ Done!");
}
