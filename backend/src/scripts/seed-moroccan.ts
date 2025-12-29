import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
    ProductStatus,
} from "@medusajs/framework/utils";
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
    createRegionsWorkflow,
    createInventoryLevelsWorkflow,
    updateStoresWorkflow,
    linkSalesChannelsToProductsWorkflow,
} from "@medusajs/medusa/core-flows";

// Script dyal seed dyal hwayej t-taqlidiya l-maghribiya l store Tmurt
export default async function seedMoroccanProducts({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const inventoryModuleService = container.resolve(Modules.INVENTORY);

    logger.info("Services resolved.");

    logger.info("🇲🇦 Starting Moroccan products seed...");

    // Njibo sales channel par défaut
    const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });

    if (!defaultSalesChannel.length) {
        logger.error("No default sales channel found. Please run the main seed first.");
        return;
    }
    logger.info(`Sales channel found: ${defaultSalesChannel[0].id}`);

    // Njibo shipping profile
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });

    if (!shippingProfiles.length) {
        logger.error("No shipping profile found. Please run the main seed first.");
        return;
    }
    const shippingProfile = shippingProfiles[0];
    logger.info(`Shipping profile found: ${shippingProfile.id}`);

    // === N-checkiw l-dependencies l-mohimin ===
    const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
    const [stockLocations] = await stockLocationModuleService.listStockLocations({}, { take: 1 });
    if (!stockLocations.length) {
        logger.error("❌ No Stock Location found! Inventory will fail.");
    } else {
        logger.info(`✅ Stock Location found: ${stockLocations[0].name}`);
    }

    if (!defaultSalesChannel.length) {
        logger.error("❌ No Default Sales Channel found!");
        return;
    }
    const mySalesChannel = defaultSalesChannel[0];
    logger.info(`✅ Default Sales Channel: ${mySalesChannel.name} (${mySalesChannel.id})`);

    // === N-tiqno anna l-API Key mliya ===
    try {
        const apiKeyModuleService = container.resolve(Modules.API_KEY);
        const [keys] = await apiKeyModuleService.listApiKeys({ token: "pk_de57ae3fca5f8247b8c3ae90b60d8d8be4a59b28b11c9e00b1d6a5042c6cf225" }, { take: 1 });

        if (keys.length) {
            const key = keys[0];
            logger.info(`Found API Key: ${key.token}`);

            // Link to Sales Channel using a workflow or manually? 
            // We can use the link service directly if needed, but better via workflow or check if linked.
            // For now, let's assume it should be linked. We'll try to link it using 'linkSalesChannelsToApiKeyWorkflow' if available, 
            // or just trust it. Actually, better to log if we can't easily check.
            // But wait, we can reuse 'linkSalesChannelsToApiKeyWorkflow' from @medusajs/medusa/core-flows
        } else {
            logger.warn("⚠️ Default Publishable Key not found in DB. Frontend might fail.");
        }
    } catch (e) {
        logger.error(`Error checking keys: ${e}`);
    }

    // === N-updaiw l-homlat dyal store ===
    try {
        const storeModuleService = container.resolve(Modules.STORE);
        const [store] = await storeModuleService.listStores();
        if (store) {
            await updateStoresWorkflow(container).run({
                input: {
                    selector: { id: store.id },
                    update: {
                        supported_currencies: [
                            { currency_code: "eur", is_default: true },
                            { currency_code: "usd" },
                            { currency_code: "mad" },
                        ],
                    },
                },
            });
            logger.info("✅ Added MAD currency to store.");
        } else {
            logger.error("❌ No store found to update currencies.");
        }
    } catch (err) {
        logger.error(`❌ Failed to update store currencies: ${err}`);
    }

    // === N-sowbo region dyal l-Maghrib ===
    try {
        const regionModuleService = container.resolve(Modules.REGION);
        // Njibo la liste dyal regions b tariqa s7i7a (mantzerbouch nakhdo lowel)
        const regions = await regionModuleService.listRegions({ countries: ["ma"] }, { take: 1 });

        let regionId: string;
        if (regions.length > 0) {
            regionId = regions[0].id;
            logger.info(`Region 'Morocco' already exists: ${regionId}`);
        } else {
            const { result: regionResult } = await createRegionsWorkflow(container).run({
                input: {
                    regions: [
                        {
                            name: "Morocco",
                            currency_code: "mad",
                            countries: ["ma"],
                            payment_providers: ["pp_system_default"],
                        },
                    ],
                },
            });
            regionId = regionResult[0].id;
            logger.info(`✅ Created 'Morocco' region: ${regionId}`);
        }
    } catch (err) {
        logger.error(`❌ Failed to create/find Morocco region: ${err}`);
    }

    // Get product module service
    // === N-ms7o koulchi: ga3 les produits w categories ===
    const productModuleService = container.resolve(Modules.PRODUCT);
    try {
        logger.info("� Nuking all existing products and categories...");
        const [products] = await productModuleService.listAndCountProducts({}, { take: 10000 });
        if (products.length) {
            await productModuleService.deleteProducts(products.map(p => p.id));
            logger.info(`🗑️ Deleted ${products.length} products.`);
        }

        const [categories] = await productModuleService.listAndCountProductCategories({}, { take: 10000 });
        if (categories.length) {
            await productModuleService.deleteProductCategories(categories.map(c => c.id));
            logger.info(`🗑️ Deleted ${categories.length} categories.`);
        }
    } catch (e) {
        logger.error(`Error cleaning slate: ${e}`);
    }

    // === N-updaiw l-fulfillment dyal l-Maghrib ===
    try {
        const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
        const [fulfillmentSets] = await fulfillmentModuleService.listFulfillmentSets({}, { relations: ["service_zones", "service_zones.geo_zones"] });

        if (fulfillmentSets.length > 0) {
            const europeZone = fulfillmentSets[0].service_zones.find(z => z.name === "Europe");
            if (europeZone) {
                // N-choufo wach 'ma' deja kayna bash mant3awdouch
                const maExists = europeZone.geo_zones.some(g => g.country_code === "ma");
                if (!maExists) {
                    await fulfillmentModuleService.createGeoZones([
                        {
                            service_zone_id: europeZone.id,
                            country_code: "ma",
                            type: "country"
                        }
                    ]);
                    logger.info("✅ Added 'ma' (Morocco) to Fulfillment Service Zone.");
                } else {
                    logger.info("'ma' already in Fulfillment Service Zone.");
                }
            }
        }
    } catch (e) {
        logger.error(`Error updating fulfillment: ${e}`);
    }

    logger.info("Creating Moroccan product categories...");

    // N-sowbo categories dyal hwayej t-taqlidiya
    // We check if they exist first to avoid errors if re-run, although the workflow might handle upsert
    // For simplicity in this seed script, we'll try to create them via workflow. 
    // If they exist, we might get duplicate key errors unless we verify. 
    // However, the standard medusa seed usually assumes a fresh start or handles idempotency.
    // We will use the workflow as before.

    try {
        const { result: categoryResult } = await createProductCategoriesWorkflow(
            container
        ).run({
            input: {
                product_categories: [
                    {
                        name: "Djellaba",
                        handle: "djellaba",
                        is_active: true,
                    },
                    {
                        name: "Kaftan",
                        handle: "kaftan",
                        is_active: true,
                    },
                    {
                        name: "Takchita",
                        handle: "takchita",
                        is_active: true,
                    },
                    {
                        name: "Jabador",
                        handle: "jabador",
                        is_active: true,
                    },
                    {
                        name: "Babouche",
                        handle: "babouche",
                        is_active: true,
                    },
                    {
                        name: "Accessories",
                        handle: "accessories",
                        is_active: true,
                    },
                ],
            },
        });
        logger.info("Categories created successfully.");


        logger.info("N-sowbo les produits dyal l-Maghrib...");

        // Helper bash nlqaw categorie b smiya
        const getCat = (name: string) => categoryResult.find((cat) => cat.name === name);

        const djellabaCategory = getCat("Djellaba");
        const kaftanCategory = getCat("Kaftan");
        const takchitaCategory = getCat("Takchita");
        const jabadorCategory = getCat("Jabador");
        const baboucheCategory = getCat("Babouche");
        const accessoriesCategory = getCat("Accessories");

        if (!djellabaCategory || !kaftanCategory) {
            logger.error("Failed to retrieve created categories. Exiting.");
            return;
        }

        // N-sowbo les produits dyal l-Maghrib
        const { result: productResult } = await createProductsWorkflow(container).run({
            input: {
                products: [
                    // === Produit: DJELLABA ===
                    {
                        title: "Djellaba Traditionnelle Homme",
                        handle: "djellaba-homme-traditional",
                        description: "جلابة تقليدية للرجال - Authentic handcrafted men's djellaba made from premium Moroccan fabric. Perfect for daily wear or special occasions. Features traditional embroidery and comfortable loose fit.",
                        category_ids: [djellabaCategory.id],
                        weight: 600,
                        status: ProductStatus.PUBLISHED,
                        shipping_profile_id: shippingProfile.id,
                        images: [
                            { url: "http://localhost:8000/images/products/djellaba_homme.png" },
                        ],
                        options: [
                            { title: "Size", values: ["S", "M", "L", "XL", "XXL"] },
                            { title: "Color", values: ["White", "Brown", "Grey", "Navy"] },
                        ],
                        variants: [
                            {
                                title: "S / White",
                                sku: "DJEL-H-S-WHITE",
                                options: { Size: "S", Color: "White" },
                                prices: [
                                    { amount: 350, currency_code: "mad" },
                                    { amount: 35, currency_code: "eur" },
                                    { amount: 38, currency_code: "usd" },
                                ],
                            },
                            {
                                title: "M / White",
                                sku: "DJEL-H-M-WHITE",
                                options: { Size: "M", Color: "White" },
                                prices: [
                                    { amount: 350, currency_code: "mad" },
                                    { amount: 35, currency_code: "eur" },
                                    { amount: 38, currency_code: "usd" },
                                ],
                            },
                            {
                                title: "M / Brown",
                                sku: "DJEL-H-M-BROWN",
                                options: { Size: "M", Color: "Brown" },
                                prices: [
                                    { amount: 380, currency_code: "mad" },
                                    { amount: 38, currency_code: "eur" },
                                    { amount: 42, currency_code: "usd" },
                                ],
                            },
                        ],
                        sales_channels: [{ id: defaultSalesChannel[0].id }],
                    },
                    {
                        title: "Djellaba Femme Brodée",
                        handle: "djellaba-femme-brodee",
                        description: "جلابة نسائية مطرزة - Elegant women's djellaba with intricate hand embroidery. Made from soft breathable fabric with beautiful traditional Moroccan patterns.",
                        category_ids: [djellabaCategory.id],
                        weight: 500,
                        status: ProductStatus.PUBLISHED,
                        shipping_profile_id: shippingProfile.id,
                        images: [
                            { url: "http://localhost:8000/images/products/djellaba_femme.png" },
                        ],
                        options: [
                            { title: "Size", values: ["S", "M", "L", "XL"] },
                            { title: "Color", values: ["Pink", "Blue", "Beige"] },
                        ],
                        variants: [
                            {
                                title: "S / Pink",
                                sku: "DJEL-F-S-PINK",
                                options: { Size: "S", Color: "Pink" },
                                prices: [
                                    { amount: 450, currency_code: "mad" },
                                    { amount: 45, currency_code: "eur" },
                                    { amount: 50, currency_code: "usd" },
                                ],
                            },
                            {
                                title: "M / Blue",
                                sku: "DJEL-F-M-BLUE",
                                options: { Size: "M", Color: "Blue" },
                                prices: [
                                    { amount: 450, currency_code: "mad" },
                                    { amount: 45, currency_code: "eur" },
                                    { amount: 50, currency_code: "usd" },
                                ],
                            },
                        ],
                        sales_channels: [{ id: defaultSalesChannel[0].id }],
                    },

                    // === Produit: KAFTAN ===
                    {
                        title: "Kaftan Royal Marocain",
                        handle: "kaftan-royal",
                        description: "قفطان ملكي مغربي - Luxurious Moroccan kaftan with gold embroidery. Perfect for weddings and special celebrations. Handcrafted by skilled artisans in Fez.",
                        category_ids: [kaftanCategory.id],
                        weight: 800,
                        status: ProductStatus.PUBLISHED,
                        shipping_profile_id: shippingProfile.id,
                        images: [
                            { url: "http://localhost:8000/images/products/kaftan_royal.png" },
                        ],
                        options: [
                            { title: "Size", values: ["S", "M", "L", "XL"] },
                            { title: "Color", values: ["Gold", "Burgundy", "Emerald"] },
                        ],
                        variants: [
                            {
                                title: "M / Gold",
                                sku: "KAFT-M-GOLD",
                                options: { Size: "M", Color: "Gold" },
                                prices: [
                                    { amount: 2500, currency_code: "mad" },
                                    { amount: 250, currency_code: "eur" },
                                    { amount: 275, currency_code: "usd" },
                                ],
                            },
                            {
                                title: "L / Burgundy",
                                sku: "KAFT-L-BURGUNDY",
                                options: { Size: "L", Color: "Burgundy" },
                                prices: [
                                    { amount: 2800, currency_code: "mad" },
                                    { amount: 280, currency_code: "eur" },
                                    { amount: 310, currency_code: "usd" },
                                ],
                            },
                        ],
                        sales_channels: [{ id: defaultSalesChannel[0].id }],
                    },

                    // === Produit: TAKCHITA ===
                    {
                        title: "Takchita Mariée Luxury",
                        handle: "takchita-mariee",
                        description: "تكشيطة العروس - Stunning bridal takchita with Swarovski crystals and premium silk fabric. A two-piece masterpiece for the perfect Moroccan wedding.",
                        category_ids: [takchitaCategory ? takchitaCategory.id : kaftanCategory.id], // Fallback if takchita unexpected issue
                        weight: 1200,
                        status: ProductStatus.PUBLISHED,
                        shipping_profile_id: shippingProfile.id,
                        images: [
                            { url: "http://localhost:8000/images/products/takchita_bridal.png" },
                        ],
                        options: [
                            { title: "Size", values: ["S", "M", "L", "XL"] },
                            { title: "Color", values: ["White & Gold", "Ivory & Silver"] },
                        ],
                        variants: [
                            {
                                title: "M / White & Gold",
                                sku: "TAKCH-M-WHITEGOLD",
                                options: { Size: "M", Color: "White & Gold" },
                                prices: [
                                    { amount: 8000, currency_code: "mad" },
                                    { amount: 800, currency_code: "eur" },
                                    { amount: 880, currency_code: "usd" },
                                ],
                            },
                        ],
                        sales_channels: [{ id: defaultSalesChannel[0].id }],
                    },

                    // === Produit: JABADOR ===
                    {
                        title: "Jabador Homme Moderne",
                        handle: "jabador-homme-moderne",
                        description: "جبادور رجالي عصري - Modern men's jabador combining traditional style with contemporary design. Perfect for Eid celebrations and family gatherings.",
                        category_ids: [jabadorCategory ? jabadorCategory.id : djellabaCategory.id],
                        weight: 700,
                        status: ProductStatus.PUBLISHED,
                        shipping_profile_id: shippingProfile.id,
                        images: [
                            { url: "http://localhost:8000/images/products/jabador_homme.png" },
                        ],
                        options: [
                            { title: "Size", values: ["S", "M", "L", "XL"] },
                            { title: "Color", values: ["Black", "Beige", "Navy"] },
                        ],
                        variants: [
                            {
                                title: "M / Black",
                                sku: "JABA-M-BLACK",
                                options: { Size: "M", Color: "Black" },
                                prices: [
                                    { amount: 600, currency_code: "mad" },
                                    { amount: 60, currency_code: "eur" },
                                    { amount: 66, currency_code: "usd" },
                                ],
                            },
                        ],
                        sales_channels: [{ id: defaultSalesChannel[0].id }],
                    },

                    // === Produit: BABOUCHE ===
                    {
                        title: "Babouche Cuir Fès",
                        handle: "babouche-cuir-fes",
                        description: "بلغة جلد فاس - Authentic leather babouche slippers handmade in Fez. Soft genuine leather with traditional craftsmanship passed down through generations.",
                        category_ids: [baboucheCategory ? baboucheCategory.id : accessoriesCategory.id],
                        weight: 300,
                        status: ProductStatus.PUBLISHED,
                        shipping_profile_id: shippingProfile.id,
                        images: [
                            { url: "http://localhost:8000/images/products/babouche_fes.png" },
                        ],
                        options: [
                            { title: "Size", values: ["40", "41", "42", "43", "44"] },
                            { title: "Color", values: ["Yellow", "Black"] },
                        ],
                        variants: [
                            {
                                title: "42 / Yellow",
                                sku: "BABOU-42-YEL",
                                options: { Size: "42", Color: "Yellow" },
                                prices: [
                                    { amount: 180, currency_code: "mad" },
                                    { amount: 18, currency_code: "eur" },
                                    { amount: 20, currency_code: "usd" },
                                ],
                            },
                        ],
                        sales_channels: [{ id: defaultSalesChannel[0].id }],
                    },
                ],
            },
        });

        logger.info(`✅ Created ${productResult.length} Moroccan products`);

        // === N-rbtouhom b sales channel bzzez ===
        logger.info(`Linking ${productResult.length} products to Sales Channel: ${defaultSalesChannel[0].name}`);

        await linkSalesChannelsToProductsWorkflow(container).run({
            input: {
                sales_channel_id: defaultSalesChannel[0].id,
                products_ids: productResult.map((p) => p.id),
            },
        });

        logger.info("✅ Linked products to Sales Channel via Workflow.");

        // === N-qado stock ===
        logger.info("📦 Setting up inventory...");

        const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
        const [stockLocations] = await stockLocationModuleService.listStockLocations({}, { take: 1 });

        if (stockLocations.length) {
            const stockLocation = stockLocations[0];
            const inventoryService = container.resolve(Modules.INVENTORY);
            const link = container.resolve(ContainerRegistrationKeys.LINK);

            for (const product of productResult) {
                if (!product.variants) continue;

                for (const variant of product.variants) {
                    try {
                        // N-sowbo Inventory Item
                        const inventoryItem = await inventoryService.createInventoryItems({
                            sku: variant.sku,
                        });

                        // N-rbtou Variant b Inventory Item
                        await link.create({
                            [Modules.PRODUCT]: {
                                variant_id: variant.id,
                            },
                            [Modules.INVENTORY]: {
                                inventory_item_id: inventoryItem.id,
                            },
                        });

                        // N-sowbo Inventory Level
                        await inventoryService.createInventoryLevels({
                            inventory_item_id: inventoryItem.id,
                            location_id: stockLocation.id,
                            stocked_quantity: 100,
                        });
                    } catch (invError) {
                        logger.warn(`Failed to set inventory for ${variant.sku}: ${invError}`);
                    }
                }
            }
            logger.info("✅ Inventory stocked (100 per item).");
        } else {
            logger.warn("⚠️ No stock location found. Inventory skipped.");
        }

        // === Fix Lakher: N-rbtou API Key b Sales Channel ===
        try {
            const apiKeyModuleService = container.resolve(Modules.API_KEY);
            const token = "pk_de57ae3fca5f8247b8c3ae90b60d8d8be4a59b28b11c9e00b1d6a5042c6cf225";
            const [keys] = await apiKeyModuleService.listApiKeys({ token }, { take: 1 });

            if (keys.length) {
                logger.info(`🔗 Ensuring API Key ${keys[0].id} is linked to Sales Channel ${defaultSalesChannel[0].id}...`);
                await apiKeyModuleService.addSalesChannels(keys[0].id, [defaultSalesChannel[0].id]);
                logger.info("✅ API Key connection secured.");
            } else {
                logger.warn("⚠️ Publishable Key not found. Frontend might not see products.");
            }
        } catch (e) {
            logger.error(`Error linking API Key: ${e}`);
        }

        logger.info("🇲🇦 Finished seeding Moroccan products!");
        logger.info("Categories created: Djellaba, Kaftan, Takchita, Jabador, Babouche, Accessories");
    } catch (e) {
        logger.error(`Error seeding Moroccan products: ${e}`);
    }
}
