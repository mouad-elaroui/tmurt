/**
 * Comprehensive Debug Script
 * Check all aspects of product availability
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function comprehensiveDebug({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const pricingModuleService = container.resolve(Modules.PRICING);
    const regionModuleService = container.resolve(Modules.REGION);

    logger.info("🔍 COMPREHENSIVE DEBUG\n");

    // 1. Check Regions and their currencies
    logger.info("═══════════════════════════════════════");
    logger.info("1. REGIONS & CURRENCIES");
    logger.info("═══════════════════════════════════════");

    const regions = await regionModuleService.listRegions({});
    for (const region of regions) {
        logger.info(`${region.name} (${region.id})`);
        logger.info(`   Currency: ${region.currency_code}`);
        logger.info(`   Countries: ${region.countries?.map((c: any) => c.iso_2).join(", ") || "none"}`);
    }

    // 2. Check product prices
    logger.info("\n═══════════════════════════════════════");
    logger.info("2. PRODUCT PRICES (Emerald Kaftan)");
    logger.info("═══════════════════════════════════════");

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
        filters: {
            handle: "emerald-velvet-kaftan"
        }
    });

    if (products.length === 0) {
        logger.error("Product not found!");
        return;
    }

    const product = products[0];
    logger.info(`Product: ${product.title}`);

    for (const variant of product.variants || []) {
        logger.info(`\n  Variant: ${variant.title} (${variant.sku})`);
        logger.info(`    Price Set ID: ${variant.price_set?.id || "NONE!"}`);

        const prices = variant.price_set?.prices || [];
        logger.info(`    Prices: ${prices.length}`);

        for (const price of prices) {
            logger.info(`      - ${price.currency_code.toUpperCase()}: ${price.amount} (id: ${price.id})`);
        }

        const hasEur = prices.some((p: any) => p.currency_code === "eur");
        const hasMad = prices.some((p: any) => p.currency_code === "mad");

        logger.info(`    Has EUR: ${hasEur ? "✅" : "❌"}`);
        logger.info(`    Has MAD: ${hasMad ? "✅" : "❌"}`);
    }

    // 3. Check if MAD prices exist directly in pricing module
    logger.info("\n═══════════════════════════════════════");
    logger.info("3. ALL MAD PRICES IN SYSTEM");
    logger.info("═══════════════════════════════════════");

    const allPrices = await pricingModuleService.listPrices({
        currency_code: "mad"
    });

    logger.info(`Total MAD prices in database: ${allPrices.length}`);
    if (allPrices.length > 0) {
        logger.info(`Sample: ${JSON.stringify(allPrices[0])}`);
    }

    // 4. Check calculated prices for Morocco region
    logger.info("\n═══════════════════════════════════════");
    logger.info("4. CALCULATED PRICES FOR MOROCCO");
    logger.info("═══════════════════════════════════════");

    const moroccoRegion = regions.find((r: any) => r.currency_code === "mad");
    if (!moroccoRegion) {
        logger.error("Morocco region not found!");
        return;
    }

    logger.info(`Morocco Region ID: ${moroccoRegion.id}`);

    // Try to get calculated prices
    for (const variant of product.variants || []) {
        if (!variant.price_set?.id) continue;

        try {
            const calculated = await pricingModuleService.calculatePrices({
                id: [variant.price_set.id]
            }, {
                context: {
                    currency_code: "mad",
                    region_id: moroccoRegion.id
                }
            });

            logger.info(`  ${variant.title}: ${JSON.stringify(calculated)}`);
        } catch (e: any) {
            logger.error(`  ${variant.title}: Error - ${e.message}`);
        }
    }

    logger.info("\n✅ Debug complete!");
}
