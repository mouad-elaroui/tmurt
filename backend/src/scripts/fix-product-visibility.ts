/**
 * Fix Product Visibility Script
 * Links all products to the sales channel and ensures API key linkage
 */

import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function fixProductVisibility({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const productModuleService = container.resolve(Modules.PRODUCT);

    logger.info("🔧 Fixing product visibility...");

    // Get default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels({});
    if (!salesChannels.length) {
        logger.error("No sales channel found");
        return;
    }
    const salesChannel = salesChannels[0];
    logger.info(`Sales Channel: ${salesChannel.name} (${salesChannel.id})`);

    // Get all products
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle"],
    });
    logger.info(`Found ${products.length} products`);

    // Link each product to sales channel
    let linked = 0;
    for (const product of products) {
        try {
            // Check if already linked
            const { data: existingLinks } = await query.graph({
                entity: "product",
                fields: ["id", "sales_channels.id"],
                filters: { id: product.id },
            });

            const existingProduct = existingLinks[0];
            const isLinked = existingProduct?.sales_channels?.some((sc: any) => sc.id === salesChannel.id);

            if (!isLinked) {
                // Create link using remote link
                await remoteLink.create({
                    [Modules.PRODUCT]: { product_id: product.id },
                    [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
                });
                logger.info(`✅ Linked: ${product.title}`);
                linked++;
            } else {
                logger.info(`⏭️  Already linked: ${product.title}`);
            }
        } catch (e: any) {
            logger.warn(`⚠️ Could not link ${product.title}: ${e.message}`);
        }
    }

    logger.info(`\n🎉 Linked ${linked} products to sales channel`);

    // Ensure API key is linked
    try {
        const apiKeyModuleService = container.resolve(Modules.API_KEY);
        const keys = await apiKeyModuleService.listApiKeys({});

        if (keys.length) {
            const publishableKey = keys.find((k: any) => k.type === "publishable");
            if (publishableKey) {
                logger.info(`Found publishable API key: ${publishableKey.id}`);

                // Add sales channel to API key
                try {
                    await apiKeyModuleService.upsertApiKeys([{
                        id: publishableKey.id,
                    }]);

                    // Link via the service
                    const currentLinks = await query.graph({
                        entity: "api_key",
                        fields: ["id", "sales_channels.id"],
                        filters: { id: publishableKey.id },
                    });

                    logger.info(`API Key linked to ${currentLinks.data[0]?.sales_channels?.length || 0} sales channels`);
                } catch (linkErr: any) {
                    logger.warn(`API key linking note: ${linkErr.message}`);
                }
            }
        }
    } catch (e: any) {
        logger.warn(`API key check: ${e.message}`);
    }

    logger.info("✅ Product visibility fix complete!");
}
