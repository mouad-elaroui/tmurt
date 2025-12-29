import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function debugCategories({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const productModuleService = container.resolve(Modules.PRODUCT);

    logger.info("Debugging categories...");

    // Try different methods
    const cats = await productModuleService.listProductCategories({}, { take: 100 });
    logger.info(`Found ${cats.length} categories`);

    for (const cat of cats) {
        logger.info(`Category: ${JSON.stringify({ id: cat.id, handle: cat.handle, name: cat.name })}`);
    }
}
