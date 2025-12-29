
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function checkSCLink({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const apiKeyService = container.resolve(Modules.API_KEY);
    const scService = container.resolve(Modules.SALES_CHANNEL);
    const productService = container.resolve(Modules.PRODUCT);
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY);

    // 1. Check Key
    const token = "pk_de57ae3fca5f8247b8c3ae90b60d8d8be4a59b28b11c9e00b1d6a5042c6cf225";
    const [keys] = await apiKeyService.listApiKeys({ token }, { take: 1 });
    if (!keys.length) {
        logger.error("❌ API Key not found in DB!");
    } else {
        const key = keys[0];
        logger.info(`✅ API Key found: ${key.id}`);
        // Check links for key
        const keyLinks = await remoteQuery({
            entryPoint: "api_key_sales_channel",
            fields: ["sales_channel_id"],
            variables: { filters: { api_key_id: key.id } }
        });
        logger.info(`🔑 Key linked to SCs: ${JSON.stringify(keyLinks)}`);
    }

    // 2. Check Products
    const [products] = await productService.listAndCountProducts({}, { take: 5 });
    logger.info(`Found ${products.length} products.`);
    for (const p of products) {
        // Check links for product
        const proLinks = await remoteQuery({
            entryPoint: "product_sales_channel",
            fields: ["sales_channel_id"],
            variables: { filters: { product_id: p.id } }
        });
        logger.info(`📦 Product ${p.title} linked to SCs: ${JSON.stringify(proLinks)}`);
    }

    // 3. List All SCs
    const [scs] = await scService.listSalesChannels({}, { take: 10 });
    scs.forEach(sc => logger.info(`📢 SC: ${sc.name} (${sc.id})`));
}
