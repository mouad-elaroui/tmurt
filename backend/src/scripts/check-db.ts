
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function checkDB({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY);

    const query = {
        product: {
            fields: ["id", "title", "status"],
        },
    };

    const { product } = await remoteQuery(query);

    logger.info(`🔍 DB SCAN RESULT: Found ${product.length} products.`);
    product.forEach(p => logger.info(`- ${p.title} (${p.status})`));
}
