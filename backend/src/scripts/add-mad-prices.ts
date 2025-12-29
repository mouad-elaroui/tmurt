/**
 * Script bash n-zido prix b MAD v2
 * Kazid prix b d-drhem l ga3 les variants
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function addMadPricesV2({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const pricingModuleService = container.resolve(Modules.PRICING);

    logger.info("💰 Adding MAD prices to products (v2)...");

    // Njibo ga3 les produits b les variants o les prix
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "variants.id",
            "variants.title",
            "variants.price_set.id",
            "variants.price_set.prices.*",
        ],
    });

    logger.info(`Found ${products.length} products`);
    let added = 0;
    let skipped = 0;

    for (const product of products) {
        logger.info(`\n📦 ${product.title}`);

        for (const variant of product.variants || []) {
            const priceSet = variant.price_set;
            if (!priceSet) {
                logger.warn(`  ⚠️ Variant ${variant.title} has no price set!`);
                continue;
            }

            const prices = priceSet.prices || [];
            const eurPrice = prices.find((p: any) => p.currency_code === "eur");
            const madPrice = prices.find((p: any) => p.currency_code === "mad");

            if (madPrice) {
                logger.info(`  ✅ ${variant.title}: already has MAD price (${madPrice.amount})`);
                skipped++;
                continue;
            }

            if (!eurPrice) {
                logger.warn(`  ⚠️ ${variant.title}: no EUR price to convert from!`);
                continue;
            }

            // N-convertiw men EUR l MAD (darbna f 10.5, o qadinah l 50 l-qriba)
            const eurAmount = eurPrice.amount;
            const madAmount = Math.ceil((eurAmount * 10.5) / 50) * 50;

            logger.info(`  ➕ ${variant.title}: ${eurAmount} EUR -> ${madAmount} MAD`);

            try {
                await pricingModuleService.addPrices({
                    priceSetId: priceSet.id,
                    prices: [
                        {
                            currency_code: "mad",
                            amount: madAmount,
                        }
                    ]
                });
                added++;
            } catch (err: any) {
                logger.error(`  ❌ Error: ${err.message}`);
            }
        }
    }

    logger.info(`\n✅ Done! Added ${added} MAD prices, skipped ${skipped}`);
}
