// Script to add inventory to all products
// Run with: bun run medusa exec ./src/scripts/add-inventory.ts

import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function addInventory({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const inventoryService = container.resolve(Modules.INVENTORY)
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
    const productService = container.resolve(Modules.PRODUCT)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    logger.info("=== ADDING INVENTORY TO ALL PRODUCTS ===\n")

    // Get stock location
    const stockLocations = await stockLocationService.listStockLocations({})
    if (!stockLocations.length) {
        logger.error("Ma kaynch stock location! Run seed:store first.")
        return
    }
    const stockLocation = stockLocations[0]
    logger.info(`Stock location: ${stockLocation.name} (${stockLocation.id})`)

    // Get all product variants
    const products = await productService.listProducts({}, { relations: ["variants"] })
    logger.info(`Found ${products.length} products\n`)

    let added = 0
    let skipped = 0

    for (const product of products) {
        logger.info(`Product: ${product.title}`)

        for (const variant of product.variants || []) {
            try {
                // Check if variant has inventory item linked
                const links = await link.list({
                    product_variant_id: variant.id,
                })

                let inventoryItemId = links.find((l: Record<string, string>) => l.inventory_item_id)?.inventory_item_id

                if (!inventoryItemId) {
                    // Create inventory item for this variant
                    const [inventoryItem] = await inventoryService.createInventoryItems([{
                        sku: variant.sku || `SKU-${variant.id}`,
                        title: variant.title,
                    }])
                    inventoryItemId = inventoryItem.id

                    // Link to variant
                    await link.create({
                        [Modules.PRODUCT]: { variant_id: variant.id },
                        [Modules.INVENTORY]: { inventory_item_id: inventoryItemId },
                    })
                    logger.info(`  -> Created inventory item for ${variant.title}`)
                }

                // Check existing inventory levels
                const levels = await inventoryService.listInventoryLevels({
                    inventory_item_id: inventoryItemId,
                    location_id: stockLocation.id,
                })

                if (levels.length === 0) {
                    // Create inventory level with stock
                    await inventoryService.createInventoryLevels([{
                        inventory_item_id: inventoryItemId,
                        location_id: stockLocation.id,
                        stocked_quantity: 100,
                    }])
                    added++
                    logger.info(`  -> Added 100 units for ${variant.title}`)
                } else if (levels[0].stocked_quantity === 0) {
                    // Update to have stock
                    await inventoryService.updateInventoryLevels([{
                        id: levels[0].id,
                        stocked_quantity: 100,
                    }])
                    added++
                    logger.info(`  -> Updated to 100 units for ${variant.title}`)
                } else {
                    skipped++
                    logger.info(`  -> Already has ${levels[0].stocked_quantity} units for ${variant.title}`)
                }
            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : String(error)
                logger.error(`  -> Error with ${variant.title}: ${msg}`)
            }
        }
    }

    logger.info(`\n=== DONE: Added/Updated ${added} inventory levels, Skipped ${skipped} ===`)
}
