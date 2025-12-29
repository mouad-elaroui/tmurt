
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function debugInternal({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const productModuleService = container.resolve(Modules.PRODUCT);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const apiKeyModuleService = container.resolve(Modules.API_KEY);

    // List all products
    const [products, count] = await productModuleService.listAndCountProducts({}, { take: 100 });
    logger.info(`Found ${count} products in DB.`);
    products.forEach(p => logger.info(`- Product: ${p.title} (${p.id}) Status: ${p.status}`));

    // List Sales Channels
    const [scs] = await salesChannelModuleService.listAndCountSalesChannels();
    logger.info(`Found ${scs.length} Sales Channels.`);
    scs.forEach(sc => logger.info(`- SC: ${sc.name} (${sc.id})`));

    // Check API Keys (Publishable)
    const [keys] = await apiKeyModuleService.listApiKeys({ type: "publishable" }, { take: 10 });
    keys.forEach(k => logger.info(`- Key: ${k.title} (${k.token})`));
}
