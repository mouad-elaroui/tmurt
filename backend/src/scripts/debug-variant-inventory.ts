/**
 * N-debugiw configuration dyal stock dyal les variants
 * N-choufou wach manage_inventory mrigel mzian
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function debugVariantInventory({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("🔍 Debugging variant inventory configuration...\n");

    // Njibo les produits l-jdad
    const newProductHandles = [
        "emerald-velvet-kaftan",
        "kaftan-royal"  // Bash nqarno biha
    ];

    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "handle",
            "variants.id",
            "variants.title",
            "variants.manage_inventory",
            "variants.allow_backorder",
            "variants.inventory_quantity",
        ],
        filters: {
            handle: newProductHandles,
        },
    });

    for (const product of products) {
        logger.info(`\n📦 ${product.title} (${product.handle})`);
        logger.info("─".repeat(50));

        for (const variant of product.variants || []) {
            logger.info(`  Variant: ${variant.title}`);
            logger.info(`    manage_inventory: ${variant.manage_inventory}`);
            logger.info(`    allow_backorder: ${variant.allow_backorder}`);
            logger.info(`    inventory_quantity: ${variant.inventory_quantity}`);
        }
    }

    logger.info("\n✅ Done!");
}
