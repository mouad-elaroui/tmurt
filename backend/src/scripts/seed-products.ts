import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
    linkProductsToSalesChannelWorkflow,
} from "@medusajs/medusa/core-flows"

// categories tmurt
const CATEGORIES = [
    { name: "Djellaba", handle: "djellaba", is_active: true },
    { name: "Kaftan", handle: "kaftan", is_active: true },
    { name: "Takchita", handle: "takchita", is_active: true },
    { name: "Jabador", handle: "jabador", is_active: true },
    { name: "Babouche", handle: "babouche", is_active: true },
    { name: "Accessories", handle: "accessories", is_active: true },
]

// product template type
interface ProductTemplate {
    title: string
    handle: string
    description: string
    category: string
    weight: number
    image: string
    options: { title: string; values: string[] }[]
    variants: {
        title: string
        sku: string
        options: Record<string, string>
        prices: { amount: number; currency_code: string }[]
    }[]
}

// produits tmurt
const PRODUCTS: ProductTemplate[] = [
    {
        title: "Djellaba Traditionnelle Homme",
        handle: "djellaba-homme-traditional",
        description: "Djellaba taqlidiya l-rjal - authentic handcrafted men's djellaba from premium Moroccan fabric",
        category: "Djellaba",
        weight: 600,
        image: "http://localhost:8000/images/products/djellaba_homme.png",
        options: [
            { title: "Size", values: ["S", "M", "L", "XL", "XXL"] },
            { title: "Color", values: ["White", "Brown", "Grey", "Navy"] },
        ],
        variants: [
            { title: "S / White", sku: "DJEL-H-S-WHITE", options: { Size: "S", Color: "White" }, prices: [{ amount: 350, currency_code: "mad" }, { amount: 35, currency_code: "eur" }, { amount: 38, currency_code: "usd" }] },
            { title: "M / White", sku: "DJEL-H-M-WHITE", options: { Size: "M", Color: "White" }, prices: [{ amount: 350, currency_code: "mad" }, { amount: 35, currency_code: "eur" }, { amount: 38, currency_code: "usd" }] },
            { title: "M / Brown", sku: "DJEL-H-M-BROWN", options: { Size: "M", Color: "Brown" }, prices: [{ amount: 380, currency_code: "mad" }, { amount: 38, currency_code: "eur" }, { amount: 42, currency_code: "usd" }] },
        ],
    },
    {
        title: "Djellaba Femme Brodée",
        handle: "djellaba-femme-brodee",
        description: "Djellaba nsawiya m'tarza - elegant women's djellaba with intricate hand embroidery",
        category: "Djellaba",
        weight: 500,
        image: "http://localhost:8000/images/products/djellaba_femme.png",
        options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Pink", "Blue", "Beige"] },
        ],
        variants: [
            { title: "S / Pink", sku: "DJEL-F-S-PINK", options: { Size: "S", Color: "Pink" }, prices: [{ amount: 450, currency_code: "mad" }, { amount: 45, currency_code: "eur" }, { amount: 50, currency_code: "usd" }] },
            { title: "M / Blue", sku: "DJEL-F-M-BLUE", options: { Size: "M", Color: "Blue" }, prices: [{ amount: 450, currency_code: "mad" }, { amount: 45, currency_code: "eur" }, { amount: 50, currency_code: "usd" }] },
        ],
    },
    {
        title: "Kaftan Royal Marocain",
        handle: "kaftan-royal",
        description: "Kaftan malaki maghribi - luxurious with gold embroidery, perfect for weddings",
        category: "Kaftan",
        weight: 800,
        image: "http://localhost:8000/images/products/kaftan_royal.png",
        options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Gold", "Burgundy", "Emerald"] },
        ],
        variants: [
            { title: "M / Gold", sku: "KAFT-M-GOLD", options: { Size: "M", Color: "Gold" }, prices: [{ amount: 2500, currency_code: "mad" }, { amount: 250, currency_code: "eur" }, { amount: 275, currency_code: "usd" }] },
            { title: "L / Burgundy", sku: "KAFT-L-BURGUNDY", options: { Size: "L", Color: "Burgundy" }, prices: [{ amount: 2800, currency_code: "mad" }, { amount: 280, currency_code: "eur" }, { amount: 310, currency_code: "usd" }] },
        ],
    },
    {
        title: "Takchita Mariée Luxury",
        handle: "takchita-mariee",
        description: "Takchita l-3aroussa - stunning bridal with Swarovski crystals and premium silk",
        category: "Takchita",
        weight: 1200,
        image: "http://localhost:8000/images/products/takchita_bridal.png",
        options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["White & Gold", "Ivory & Silver"] },
        ],
        variants: [
            { title: "M / White & Gold", sku: "TAKCH-M-WHITEGOLD", options: { Size: "M", Color: "White & Gold" }, prices: [{ amount: 8000, currency_code: "mad" }, { amount: 800, currency_code: "eur" }, { amount: 880, currency_code: "usd" }] },
        ],
    },
    {
        title: "Jabador Homme Moderne",
        handle: "jabador-homme-moderne",
        description: "Jabador rijali 3asri - modern men's jabador, perfect for Eid celebrations",
        category: "Jabador",
        weight: 700,
        image: "http://localhost:8000/images/products/jabador_homme.png",
        options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Beige", "Navy"] },
        ],
        variants: [
            { title: "M / Black", sku: "JABA-M-BLACK", options: { Size: "M", Color: "Black" }, prices: [{ amount: 600, currency_code: "mad" }, { amount: 60, currency_code: "eur" }, { amount: 66, currency_code: "usd" }] },
        ],
    },
    {
        title: "Babouche Cuir Fès",
        handle: "babouche-cuir-fes",
        description: "Belgha jeld Fas - authentic leather babouche handmade in Fez",
        category: "Babouche",
        weight: 300,
        image: "http://localhost:8000/images/products/babouche_fes.png",
        options: [
            { title: "Size", values: ["40", "41", "42", "43", "44"] },
            { title: "Color", values: ["Yellow", "Black"] },
        ],
        variants: [
            { title: "42 / Yellow", sku: "BABOU-42-YEL", options: { Size: "42", Color: "Yellow" }, prices: [{ amount: 180, currency_code: "mad" }, { amount: 18, currency_code: "eur" }, { amount: 20, currency_code: "usd" }] },
        ],
    },
]

export default async function seedProducts({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)
    const productService = container.resolve(Modules.PRODUCT)
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
    const inventoryService = container.resolve(Modules.INVENTORY)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    logger.info("=== SEED PRODUCTS ===\n")

    // dependencies check
    const salesChannels = await salesChannelService.listSalesChannels({ name: "Default Sales Channel" })
    if (!salesChannels.length) return logger.error("Ma kaynch sales channel - run seed first")
    const salesChannel = salesChannels[0]
    logger.info(`[OK] Sales channel: ${salesChannel.id}`)

    const shippingProfiles = await fulfillmentService.listShippingProfiles({ type: "default" })
    if (!shippingProfiles.length) return logger.error("Ma kaynch shipping profile - run seed first")
    const shippingProfile = shippingProfiles[0]
    logger.info(`[OK] Shipping profile: ${shippingProfile.id}`)

    const stockLocations = await stockLocationService.listStockLocations({})
    if (!stockLocations.length) return logger.error("Ma kaynch stock location - run seed:store first")
    const stockLocation = stockLocations[0]
    logger.info(`[OK] Stock location: ${stockLocation.id}`)

    // clean existing products/categories
    logger.info("\nCleaning existing products...")
    const [existingProducts] = await productService.listAndCountProducts({}, { take: 10000 })
    if (existingProducts.length) {
        await productService.deleteProducts(existingProducts.map(p => p.id))
        logger.info(`[DELETED] ${existingProducts.length} products`)
    }

    const [existingCategories] = await productService.listAndCountProductCategories({}, { take: 10000 })
    if (existingCategories.length) {
        await productService.deleteProductCategories(existingCategories.map(c => c.id))
        logger.info(`[DELETED] ${existingCategories.length} categories`)
    }

    // create categories
    logger.info("\nCreating categories...")
    const { result: categories } = await createProductCategoriesWorkflow(container).run({
        input: { product_categories: CATEGORIES },
    })
    logger.info(`[OK] Created ${categories.length} categories`)

    const getCategoryId = (name: string) => categories.find(c => c.name === name)?.id ?? categories[0].id

    // create products
    logger.info("\nCreating products...")
    const { result: products } = await createProductsWorkflow(container).run({
        input: {
            products: PRODUCTS.map(p => ({
                title: p.title,
                handle: p.handle,
                description: p.description,
                category_ids: [getCategoryId(p.category)],
                weight: p.weight,
                status: ProductStatus.PUBLISHED,
                shipping_profile_id: shippingProfile.id,
                images: [{ url: p.image }],
                options: p.options,
                variants: p.variants,
                sales_channels: [{ id: salesChannel.id }],
            })),
        },
    })
    logger.info(`[OK] Created ${products.length} products`)

    // link to sales channel
    await linkProductsToSalesChannelWorkflow(container).run({
        input: {
            id: salesChannel.id,
            add: products.map(p => p.id),
        },
    })
    logger.info("[OK] Linked products to sales channel")

    // create inventory
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
                logger.warn(`Skip inventory: ${variant.sku}`)
            }
        }
    }
    logger.info(`[OK] Created ${inventoryCount} inventory items`)

    logger.info("\n=== DONE ===")
    logger.info(`Categories: ${categories.length}, Products: ${products.length}, Inventory: ${inventoryCount}`)
}
