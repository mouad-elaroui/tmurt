
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function fixSCLink({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const apiKeyService = container.resolve(Modules.API_KEY);
    const scService = container.resolve(Modules.SALES_CHANNEL);

    const token = "pk_de57ae3fca5f8247b8c3ae90b60d8d8be4a59b28b11c9e00b1d6a5042c6cf225";

    // 1. Get Key
    const [keys] = await apiKeyService.listApiKeys({ token }, { take: 1 });
    if (!keys.length) {
        logger.error("❌ Publishable Key NOT found in DB. This explains why Storefront sees nothing.");
        return;
    }
    const key = keys[0];
    logger.info(`✅ Found Key: ${key.id} (${key.title})`);

    // 2. Get Default Sales Channel
    const [scs] = await scService.listSalesChannels({}, { take: 1 });
    if (!scs.length) {
        logger.error("❌ No Sales Channels found in DB.");
        return;
    }
    const defaultSC = scs[0];
    logger.info(`✅ Found Default SC: ${defaultSC.id} (${defaultSC.name})`);

    // 3. Link them!
    try {
        await apiKeyService.addSalesChannels(key.id, [defaultSC.id]);
        logger.info("🔗 Successfully LINKED Key to Default Sales Channel.");
    } catch (e) {
        logger.error(`Failed to link key to SC: ${e}`);
        // If already linked, it might throw, but that's fine.
    }
}
