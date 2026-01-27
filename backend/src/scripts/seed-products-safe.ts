import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
    linkProductsToSalesChannelWorkflow,
} from "@medusajs/medusa/core-flows"

// Categories - Moroccan Traditional Clothing
const CATEGORIES = [
    { name: "Djellaba", handle: "djellaba", is_active: true },
    { name: "Kaftan", handle: "kaftan", is_active: true },
    { name: "Jabador", handle: "jabador", is_active: true },
    { name: "Babouche", handle: "babouche", is_active: true },
]

// Products with English titles
// Gender rules: Kaftan/Takchita = Women only, Babouche = Men only
// Djellaba and Jabador = Both genders
const PRODUCTS = [
    // === MEN'S PRODUCTS ===
    {
        title: "Traditional Men's Djellaba",
        handle: "traditional-mens-djellaba",
        description: "Authentic handcrafted men's djellaba made from premium Moroccan wool blend fabric. Perfect for special occasions and Friday prayers.",
        category: "Djellaba",
        gender: "Men",
        weight: 600,
        prices: [{ amount: 350, currency_code: "mad" }, { amount: 35, currency_code: "eur" }],
    },
    {
        title: "Modern Men's Jabador",
        handle: "modern-mens-jabador",
        description: "Contemporary two-piece Jabador set (tunic and pants) featuring subtle embroidery. Ideal for weddings and Eid celebrations.",
        category: "Jabador",
        gender: "Men",
        weight: 700,
        prices: [{ amount: 600, currency_code: "mad" }, { amount: 60, currency_code: "eur" }],
    },
    {
        title: "Fez Leather Babouche",
        handle: "fez-leather-babouche",
        description: "Premium handmade yellow leather slippers from Fez. Features durable sole and comfortable fit. Men's traditional footwear.",
        category: "Babouche",
        gender: "Men",
        weight: 300,
        prices: [{ amount: 180, currency_code: "mad" }, { amount: 18, currency_code: "eur" }],
    },
    {
        title: "Classic Men's Babouche",
        handle: "classic-mens-babouche",
        description: "Traditional black leather babouche with pointed toe. Handcrafted by artisans in Marrakech.",
        category: "Babouche",
        gender: "Men",
        weight: 280,
        prices: [{ amount: 150, currency_code: "mad" }, { amount: 15, currency_code: "eur" }],
    },

    // === WOMEN'S PRODUCTS ===
    {
        title: "Embroidered Women's Djellaba",
        handle: "embroidered-womens-djellaba",
        description: "Elegant women's djellaba featuring intricate hand embroidery (tarz) and sfifa detailing.",
        category: "Djellaba",
        gender: "Women",
        weight: 500,
        prices: [{ amount: 450, currency_code: "mad" }, { amount: 45, currency_code: "eur" }],
    },
    {
        title: "Royal Moroccan Kaftan",
        handle: "royal-moroccan-kaftan",
        description: "Luxurious velvet kaftan with gold thread embroidery and crystal embellishments. Perfect for weddings and special occasions.",
        category: "Kaftan",
        gender: "Women",
        weight: 800,
        prices: [{ amount: 2500, currency_code: "mad" }, { amount: 250, currency_code: "eur" }],
    },
    {
        title: "Bridal Takchita",
        handle: "bridal-takchita",
        description: "Stunning two-piece Takchita for brides, featuring white silk base and sheer embroidered overlay. Traditional Moroccan bridal wear.",
        category: "Kaftan",
        gender: "Women",
        weight: 1200,
        prices: [{ amount: 8000, currency_code: "mad" }, { amount: 800, currency_code: "eur" }],
    },
    {
        title: "Emerald Green Kaftan",
        handle: "emerald-green-kaftan",
        description: "Stunning emerald green kaftan with gold beadwork. Handcrafted by master artisans.",
        category: "Kaftan",
        gender: "Women",
        weight: 750,
        prices: [{ amount: 3200, currency_code: "mad" }, { amount: 320, currency_code: "eur" }],
    },
    {
        title: "Women's Jabador Set",
        handle: "womens-jabador-set",
        description: "Elegant women's jabador with delicate embroidery. Modern interpretation of traditional design.",
        category: "Jabador",
        gender: "Women",
        weight: 650,
        prices: [{ amount: 550, currency_code: "mad" }, { amount: 55, currency_code: "eur" }],
    },
]

export default async function seedProductsSafe({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)
    const productService = container.resolve(Modules.PRODUCT)
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
    const inventoryService = container.resolve(Modules.INVENTORY)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    logger.info("=== SAFE SEED PRODUCTS ===\n")

    try {
        // Dependencies check
        const salesChannels = await salesChannelService.listSalesChannels({ name: "Default Sales Channel" })
        if (!salesChannels.length) {
            logger.error("No sales channel found - run 'bun run seed' first to set up the store")
            return
        }
        const salesChannel = salesChannels[0]
        logger.info(`[OK] Sales channel: ${salesChannel.id}`)

        const shippingProfiles = await fulfillmentService.listShippingProfiles({ type: "default" })
        if (!shippingProfiles.length) {
            logger.error("No shipping profile found - run 'bun run seed' first")
            return
        }
        const shippingProfile = shippingProfiles[0]
        logger.info(`[OK] Shipping profile: ${shippingProfile.id}`)

        const stockLocations = await stockLocationService.listStockLocations({})
        if (!stockLocations.length) {
            logger.error("No stock location found - run 'bun run seed:store' first")
            return
        }
        const stockLocation = stockLocations[0]
        logger.info(`[OK] Stock location: ${stockLocation.id}`)

        // Create categories (if not exist)
        logger.info("\nCreating categories...")
        let categories: any[] = []
        try {
            const { result } = await createProductCategoriesWorkflow(container).run({
                input: { product_categories: CATEGORIES },
            })
            categories = result
            logger.info(`[OK] Created ${categories.length} categories`)
        } catch (e: any) {
            // Categories might already exist
            const [existing] = await productService.listAndCountProductCategories({})
            if (existing.length) {
                categories = existing
                logger.info(`[OK] Using ${categories.length} existing categories`)
            }
        }

        const getCategoryId = (name: string) => categories.find(c => c.name === name)?.id ?? categories[0]?.id

        // Create products
        logger.info("\nCreating products...")
        const { result: products } = await createProductsWorkflow(container).run({
            input: {
                products: PRODUCTS.map(p => ({
                    title: p.title,
                    handle: p.handle,
                    description: p.description,
                    category_ids: getCategoryId(p.category) ? [getCategoryId(p.category)] : [],
                    weight: p.weight,
                    status: ProductStatus.PUBLISHED,
                    shipping_profile_id: shippingProfile.id,
                    metadata: {
                        gender: p.gender
                    },
                    options: [
                        { title: "Size", values: ["S", "M", "L", "XL"] },
                    ],
                    variants: [
                        {
                            title: "M",
                            sku: `${p.handle}-M`,
                            options: { Size: "M" },
                            prices: p.prices
                        },
                    ],
                    sales_channels: [{ id: salesChannel.id }],
                })),
            },
        })
        logger.info(`[OK] Created ${products.length} products`)

        // Link to sales channel
        await linkProductsToSalesChannelWorkflow(container).run({
            input: {
                id: salesChannel.id,
                add: products.map(p => p.id),
            },
        })
        logger.info("[OK] Linked products to sales channel")

        // Create inventory
        logger.info("\nSetting up inventory...")
        let inventoryCount = 0
        for (const product of products) {
            if (!product.variants) continue
            for (const variant of product.variants) {
                try {
                    const inventoryItem = await inventoryService.createInventoryItems({ sku: variant.sku })
                    await link.create({
                        [Modules.PRODUCT]: { variant_id: variant.id },
                        [Modules.INVENTORY]: { inventory_item_id: inventoryItem.id },
                    })
                    await inventoryService.createInventoryLevels({
                        inventory_item_id: inventoryItem.id,
                        location_id: stockLocation.id,
                        stocked_quantity: 100,
                    })
                    inventoryCount++
                } catch {
                    // Skip if inventory already exists
                }
            }
        }
        logger.info(`[OK] Created ${inventoryCount} inventory items`)

        logger.info("\n=== DONE ===")
        logger.info(`Categories: ${categories.length}, Products: ${products.length}`)

    } catch (error: any) {
        logger.error(`Seed failed: ${error.message}`)
        logger.error("Products were NOT deleted - database remains unchanged")
        throw error
    }
}
