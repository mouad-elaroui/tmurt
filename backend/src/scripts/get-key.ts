
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function getKey({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const apiKeyService = container.resolve(Modules.API_KEY);

    const [keys] = await apiKeyService.listApiKeys({ type: "publishable" }, { take: 10 });
    logger.info(`🔑 Found ${keys.length} Publishable Keys:`);
    keys.forEach(k => logger.info(`- ${k.token} (${k.title})`));
}
