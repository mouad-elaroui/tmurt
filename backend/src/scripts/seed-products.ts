import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
    linkProductsToSalesChannelWorkflow,
} from "@medusajs/medusa/core-flows"

// Categories Tmurt
const CATEGORIES = [
    { name: "Djellaba", handle: "djellaba", is_active: true },
    { name: "Kaftan", handle: "kaftan", is_active: true },
    { name: "Jabador", handle: "jabador", is_active: true },
    { name: "Babouche", handle: "babouche", is_active: true },
]

// Product type with UID
interface ProductTemplate {
    uid: string // Unique ID: TM-{GENDER}-{CATEGORY}-{NUMBER}
    title: string
    handle: string
    description: string
    category: "Djellaba" | "Kaftan" | "Jabador" | "Babouche"
    gender: "Men" | "Women"
    weight: number
    image: string
    price: number
}

// Base URL l-images local (storefront public folder) - all in /products
const IMG_BASE = "http://localhost:8000/products"

// Products li user 3tana - with proper UIDs and local Moroccan images (12 total)
const PRODUCTS: ProductTemplate[] = [
    // === KAFTAN ===
    {
        uid: "TM-WOMEN-KAFTAN-001",
        title: "Kaftan Royal Marocain",
        handle: "kaftan-royal-marocain",
        description: "Luxurious royal Moroccan kaftan with gold thread embroidery and crystal embellishments.",
        category: "Kaftan",
        gender: "Women",
        weight: 800,
        image: `${IMG_BASE}/kaftan_royal.png`,
        price: 4500,
    },
    {
        uid: "TM-WOMEN-KAFTAN-002",
        title: "Burgundy Silk Kaftan",
        handle: "burgundy-silk-kaftan",
        description: "Luxurious burgundy silk kaftan with traditional Moroccan patterns and gold accents.",
        category: "Kaftan",
        gender: "Women",
        weight: 600,
        image: `${IMG_BASE}/kaftan-burgundy.png`,
        price: 3800,
    },
    {
        uid: "TM-WOMEN-KAFTAN-003",
        title: "Emerald Velvet Kaftan",
        handle: "emerald-velvet-kaftan",
        description: "Stunning emerald green velvet kaftan with intricate gold embroidery.",
        category: "Kaftan",
        gender: "Women",
        weight: 900,
        image: `${IMG_BASE}/kaftan-emerald.png`,
        price: 4200,
    },
    // === TAKCHITA ===
    {
        uid: "TM-WOMEN-TAKCHITA-001",
        title: "Golden Bridal Takchita",
        handle: "golden-bridal-takchita",
        description: "Stunning two-piece Takchita for brides, featuring white silk base and sheer embroidered overlay.",
        category: "Kaftan",
        gender: "Women",
        weight: 1200,
        image: `${IMG_BASE}/takchita_bridal.png`,
        price: 8500,
    },
    {
        uid: "TM-WOMEN-TAKCHITA-002",
        title: "Gold Celebration Takchita",
        handle: "gold-celebration-takchita",
        description: "Elegant gold takchita perfect for celebrations and special occasions.",
        category: "Kaftan",
        gender: "Women",
        weight: 1100,
        image: `${IMG_BASE}/takchita-gold.png`,
        price: 6500,
    },
    // === DJELLABA FEMME ===
    {
        uid: "TM-WOMEN-DJELLABA-001",
        title: "Djellaba Femme Élégante",
        handle: "djellaba-femme-elegante",
        description: "Elegant women's djellaba featuring intricate hand embroidery and sfifa detailing.",
        category: "Djellaba",
        gender: "Women",
        weight: 500,
        image: `${IMG_BASE}/djellaba_femme.png`,
        price: 1200,
    },
    {
        uid: "TM-WOMEN-DJELLABA-002",
        title: "Cream Winter Djellaba",
        handle: "cream-winter-djellaba",
        description: "Classic cream-colored djellaba with delicate embroidery, perfect for everyday elegance.",
        category: "Djellaba",
        gender: "Women",
        weight: 550,
        image: `${IMG_BASE}/djellaba-cream.png`,
        price: 950,
    },
    {
        uid: "TM-WOMEN-DJELLABA-003",
        title: "Navy Wool Djellaba",
        handle: "navy-wool-djellaba",
        description: "Warm navy blue wool djellaba with hood, perfect for winter occasions.",
        category: "Djellaba",
        gender: "Women",
        weight: 700,
        image: `${IMG_BASE}/djellaba-navy.png`,
        price: 1100,
    },
    // === DJELLABA HOMME ===
    {
        uid: "TM-MEN-DJELLABA-001",
        title: "Djellaba Homme Traditionnelle",
        handle: "djellaba-homme-traditionnelle",
        description: "Authentic handcrafted men's djellaba made from premium Moroccan wool blend fabric.",
        category: "Djellaba",
        gender: "Men",
        weight: 600,
        image: `${IMG_BASE}/djellaba_homme.png`,
        price: 950,
    },
    // === JABADOR ===
    {
        uid: "TM-MEN-JABADOR-001",
        title: "Classic White Jabador",
        handle: "classic-white-jabador",
        description: "Contemporary two-piece Jabador set featuring subtle embroidery. Ideal for weddings and Eid.",
        category: "Jabador",
        gender: "Men",
        weight: 700,
        image: `${IMG_BASE}/jabador_homme.png`,
        price: 750,
    },
    {
        uid: "TM-MEN-JABADOR-002",
        title: "Premium White Jabador",
        handle: "premium-white-jabador",
        description: "Premium quality white jabador with elegant embroidery details, perfect for special occasions.",
        category: "Jabador",
        gender: "Men",
        weight: 750,
        image: `${IMG_BASE}/jabador-white.png`,
        price: 850,
    },
    // === BABOUCHE ===
    {
        uid: "TM-MEN-BABOUCHE-001",
        title: "Babouche Cuir Fès",
        handle: "babouche-cuir-fes",
        description: "Premium handmade leather slippers from Fez. Traditional yellow color with durable sole.",
        category: "Babouche",
        gender: "Men",
        weight: 300,
        image: `${IMG_BASE}/babouche_fes.png`,
        price: 280,
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

    // Check dependencies
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

    // Clean existing products/categories
    logger.info("\nCleaning existing products...")
    const [existingProducts] = await productService.listAndCountProducts({}, { take: 10000 })
    if (existingProducts.length) {
        await productService.deleteProducts(existingProducts.map(p => p.id))
        logger.info(`[DELETED] ${existingProducts.length} products`)
    }

    // Clean existing inventory items - bach ma ykunch conflict f SKUs
    logger.info("Cleaning existing inventory items...")
    const [existingInventory] = await inventoryService.listInventoryItems({}, { take: 10000 })
    if (existingInventory.length) {
        // First delete inventory levels
        for (const item of existingInventory) {
            try {
                const [levels] = await inventoryService.listInventoryLevels({ inventory_item_id: item.id })
                if (levels.length) {
                    await inventoryService.deleteInventoryLevels(levels.map(l => l.id))
                }
            } catch (e) {
                // Ignore - may not exist
            }
        }
        // Then delete inventory items
        for (const item of existingInventory) {
            try {
                await inventoryService.deleteInventoryItems([item.id])
            } catch (e) {
                // Ignore errors
            }
        }
        logger.info(`[DELETED] ${existingInventory.length} inventory items`)
    }

    const [existingCategories] = await productService.listAndCountProductCategories({}, { take: 10000 })
    if (existingCategories.length) {
        await productService.deleteProductCategories(existingCategories.map(c => c.id))
        logger.info(`[DELETED] ${existingCategories.length} categories`)
    }

    // Create categories
    logger.info("\nCreating categories...")
    const { result: categories } = await createProductCategoriesWorkflow(container).run({
        input: { product_categories: CATEGORIES },
    })
    logger.info(`[OK] Created ${categories.length} categories`)

    const getCategoryId = (name: string) => categories.find(c => c.name === name)?.id ?? categories[0].id

    // Generate unique SKU suffix - bach ma ykunsh conflict
    const skuSuffix = Date.now().toString(36).slice(-4).toUpperCase()
    logger.info(`[OK] Using SKU suffix: ${skuSuffix}`)

    // Create products with UID in metadata
    logger.info("\nCreating products with UIDs...")
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
                metadata: {
                    uid: p.uid,
                    gender: p.gender,
                    category: p.category,
                },
                images: [{ url: p.image }],
                options: [
                    { title: "Size", values: ["S", "M", "L", "XL"] },
                ],
                variants: [
                    { title: "S", sku: `${p.uid}-S-${skuSuffix}`, manage_inventory: false, options: { Size: "S" }, prices: [{ amount: p.price, currency_code: "mad" }] },
                    { title: "M", sku: `${p.uid}-M-${skuSuffix}`, manage_inventory: false, options: { Size: "M" }, prices: [{ amount: p.price, currency_code: "mad" }] },
                    { title: "L", sku: `${p.uid}-L-${skuSuffix}`, manage_inventory: false, options: { Size: "L" }, prices: [{ amount: p.price, currency_code: "mad" }] },
                    { title: "XL", sku: `${p.uid}-XL-${skuSuffix}`, manage_inventory: false, options: { Size: "XL" }, prices: [{ amount: p.price, currency_code: "mad" }] },
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

    // Setup inventory
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
                    stocked_quantity: 50,
                })
                inventoryCount++
            } catch {
                logger.warn(`Skip inventory: ${variant.sku}`)
            }
        }
    }
    logger.info(`[OK] Created ${inventoryCount} inventory items`)

    // Log summary
    logger.info("\n=== DONE ===")
    logger.info(`Categories: ${categories.length}, Products: ${products.length}, Inventory: ${inventoryCount}`)
    logger.info("\nProducts with UIDs:")
    PRODUCTS.forEach(p => logger.info(`  ${p.uid} -> ${p.title} (${p.gender}, ${p.category})`))
}
