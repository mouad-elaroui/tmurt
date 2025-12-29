/**
 * Add MAD Prices to All Products
 * Converts EUR prices to MAD (1 EUR ≈ 10.5 MAD)
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function addMadPricesToAll({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const pricingModuleService = container.resolve(Modules.PRICING);

    logger.info("💰 Adding MAD prices to ALL products...\n");

    // Get all products with their variants and price sets
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "handle",
            "variants.id",
            "variants.title",
            "variants.sku",
            "variants.price_set.id",
            "variants.price_set.prices.*",
        ],
    });

    logger.info(`Found ${products.length} products`);

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
        logger.info(`\n📦 ${product.title} (${product.handle})`);

        for (const variant of product.variants || []) {
            const priceSet = variant.price_set;

            if (!priceSet || !priceSet.id) {
                logger.warn(`  ⚠️ ${variant.title}: No price set found`);
                continue;
            }

            const prices = priceSet.prices || [];
            const eurPrice = prices.find((p: any) => p.currency_code === "eur");
            const madPrice = prices.find((p: any) => p.currency_code === "mad");

            if (madPrice) {
                logger.info(`  ✅ ${variant.title}: already has MAD (${madPrice.amount})`);
                skippedCount++;
                continue;
            }

            if (!eurPrice) {
                logger.warn(`  ⚠️ ${variant.title}: No EUR price to convert`);
                continue;
            }

            // Convert EUR to MAD (approx 10.5, round to nearest 50)
            const madAmount = Math.ceil((eurPrice.amount * 10.5) / 50) * 50;

            logger.info(`  ➕ ${variant.title}: ${eurPrice.amount} EUR → ${madAmount} MAD`);

            try {
                await pricingModuleService.addPrices({
                    priceSetId: priceSet.id,
                    prices: [
                        {
                            currency_code: "mad",
                            amount: madAmount,
                        },
                    ],
                });
                addedCount++;
            } catch (err: any) {
                logger.error(`  ❌ Error: ${err.message}`);
                errorCount++;
            }
        }
    }

    logger.info("\n═══════════════════════════════════════");
    logger.info("📊 SUMMARY");
    logger.info("═══════════════════════════════════════");
    logger.info(`✅ Added: ${addedCount} MAD prices`);
    logger.info(`⏭️  Skipped: ${skippedCount} (already had MAD)`);
    logger.info(`❌ Errors: ${errorCount}`);
    logger.info("\n✅ Done!");
}
