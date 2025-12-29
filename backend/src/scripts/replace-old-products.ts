/**
 * Script bash n-bedlo les produits qdam b jdad
 * Kams7 les produits qdam o ka-ykhli jdad
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function replaceOldProducts({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const productModuleService = container.resolve(Modules.PRODUCT);

    logger.info("🔧 Checking all products in database...");

    // Njibo les produits kamlin b twachi dyalhom
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle", "thumbnail", "status"],
    });

    logger.info(`Found ${products.length} products total:`);
    for (const p of products) {
        logger.info(`  - ${p.id}: "${p.title}" (handle: ${p.handle}, status: ${p.status})`);
        logger.info(`    thumbnail: ${p.thumbnail}`);
    }

    // N-7ddo shmen produits bghina n-khliw (l-jdad)
    const newProductHandles = [
        "emerald-velvet-kaftan",
        "burgundy-silk-kaftan",
        "cream-cotton-djellaba",
        "navy-wool-djellaba",
        "golden-bridal-takchita",
        "white-cotton-jabador",
    ];

    // N-lqaw les produits l-qdam bash n-ms7ohom
    const productsToDelete = products.filter((p: any) => !newProductHandles.includes(p.handle));

    if (productsToDelete.length > 0) {
        logger.info(`\nDeleting ${productsToDelete.length} old products...`);
        for (const p of productsToDelete) {
            try {
                await productModuleService.deleteProducts([p.id]);
                logger.info(`  ❌ Deleted: ${p.title} (${p.handle})`);
            } catch (e: any) {
                logger.error(`  Failed to delete ${p.title}: ${e.message}`);
            }
        }
    } else {
        logger.info("\nNo old products to delete.");
    }

    // N-3awdo n-shoufo les produits
    const { data: remaining } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle", "status"],
    });

    logger.info(`\n✅ ${remaining.length} products remaining:`);
    for (const p of remaining) {
        logger.info(`  - ${p.title} (${p.handle})`);
    }
}
