/**
 * Verify MAD Prices Script
 * Quick check to confirm MAD prices are set
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function verifyMadPrices({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("🔍 Verifying MAD prices...\n");

    // Get the emerald kaftan and its prices
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "handle",
            "variants.id",
            "variants.title",
            "variants.price_set.prices.*",
        ],
        filters: {
            handle: "emerald-velvet-kaftan"
        }
    });

    if (!products.length) {
        logger.error("Product not found!");
        return;
    }

    const product = products[0];
    logger.info(`📦 ${product.title}`);

    for (const variant of product.variants || []) {
        logger.info(`\n  Variant: ${variant.title}`);
        const prices = variant.price_set?.prices || [];

        for (const price of prices) {
            const symbol = price.currency_code === "mad" ? "🇲🇦" : "€";
            logger.info(`    ${symbol} ${price.currency_code.toUpperCase()}: ${price.amount}`);
        }

        const hasMad = prices.some((p: any) => p.currency_code === "mad");
        if (hasMad) {
            logger.info(`    ✅ Has MAD price!`);
        } else {
            logger.warn(`    ❌ Missing MAD price!`);
        }
    }

    logger.info("\n✅ Verification complete!");
}
