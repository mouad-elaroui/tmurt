/**
 * N-zido produits marocains jdad b tswar mgeneryin
 * Script kheddam rasso b l-Query API bash yjib koulchi mrigel
 */

import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
    ProductStatus,
} from "@medusajs/framework/utils";
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
    linkSalesChannelsToProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function addNewProducts({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const productModuleService = container.resolve(Modules.PRODUCT);

    logger.info("🌿 Adding new Moroccan products with generated images...");

    // Njibo sales channel par défaut
    const salesChannels = await salesChannelModuleService.listSalesChannels({});
    if (!salesChannels.length) {
        logger.error("No sales channel found.");
        return;
    }
    const defaultSalesChannel = salesChannels[0];
    logger.info(`Sales Channel: ${defaultSalesChannel.name}`);

    // Njibo shipping profile
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({});
    if (!shippingProfiles.length) {
        logger.error("No shipping profile found.");
        return;
    }
    const shippingProfile = shippingProfiles[0];
    logger.info(`Shipping Profile: ${shippingProfile.id}`);

    // N-sta3mlo l-Query API bash njibo les catégories kamlin
    const { data: existingCategories } = await query.graph({
        entity: "product_category",
        fields: ["id", "handle", "name"],
    });

    logger.info(`Found ${existingCategories.length} categories`);

    const findCat = (handle: string) => existingCategories.find((c: any) => c.handle === handle);

    let kaftanCategory = findCat("kaftan");
    let djellabaCategory = findCat("djellaba");
    let takchitaCategory = findCat("takchita");
    let jabadorCategory = findCat("jabador");

    logger.info(`Handles found: Kaftan=${kaftanCategory?.id}, Djellaba=${djellabaCategory?.id}`);

    // N-sowbo les catégories li naqsin
    const missingCategories: any[] = [];
    if (!kaftanCategory) missingCategories.push({ name: "Kaftan", handle: "kaftan", is_active: true });
    if (!djellabaCategory) missingCategories.push({ name: "Djellaba", handle: "djellaba", is_active: true });
    if (!takchitaCategory) missingCategories.push({ name: "Takchita", handle: "takchita", is_active: true });
    if (!jabadorCategory) missingCategories.push({ name: "Jabador", handle: "jabador", is_active: true });

    if (missingCategories.length > 0) {
        logger.info(`Creating ${missingCategories.length} missing categories...`);
        try {
            const { result: newCategories } = await createProductCategoriesWorkflow(container).run({
                input: { product_categories: missingCategories },
            });

            for (const cat of newCategories) {
                if (cat.handle === "kaftan") kaftanCategory = cat;
                if (cat.handle === "djellaba") djellabaCategory = cat;
                if (cat.handle === "takchita") takchitaCategory = cat;
                if (cat.handle === "jabador") jabadorCategory = cat;
            }
            logger.info("✅ Categories created");
        } catch (e: any) {
            logger.error(`Category creation failed: ${e.message}`);
        }
    }

    if (!kaftanCategory) {
        logger.error("Cannot proceed without categories");
        return;
    }

    // Njibo les produits li deja kaynin
    const { data: existingProducts } = await query.graph({
        entity: "product",
        fields: ["handle"],
    });
    const existingHandles = existingProducts.map((p: any) => p.handle);
    logger.info(`Found ${existingProducts.length} existing products`);

    // Produits jdad
    const newProducts = [
        {
            title: "Emerald Velvet Kaftan",
            handle: "emerald-velvet-kaftan",
            description: "Luxurious deep emerald green velvet Kaftan with intricate gold embroidery.",
            category_ids: [kaftanCategory.id],
            weight: 700,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: "/products/kaftan-emerald.png" }],
            thumbnail: "/products/kaftan-emerald.png",
            options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
            variants: [
                { title: "Small", sku: "KAF-EMR-S", options: { Size: "S" }, prices: [{ amount: 450, currency_code: "eur" }] },
                { title: "Medium", sku: "KAF-EMR-M", options: { Size: "M" }, prices: [{ amount: 450, currency_code: "eur" }] },
                { title: "Large", sku: "KAF-EMR-L", options: { Size: "L" }, prices: [{ amount: 450, currency_code: "eur" }] },
                { title: "Extra Large", sku: "KAF-EMR-XL", options: { Size: "XL" }, prices: [{ amount: 480, currency_code: "eur" }] },
            ],
            sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
            title: "Burgundy Silk Kaftan",
            handle: "burgundy-silk-kaftan",
            description: "Elegant burgundy red Kaftan with silver metallic thread embroidery.",
            category_ids: [kaftanCategory.id],
            weight: 650,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: "/products/kaftan-burgundy.png" }],
            thumbnail: "/products/kaftan-burgundy.png",
            options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
            variants: [
                { title: "Small", sku: "KAF-BRG-S", options: { Size: "S" }, prices: [{ amount: 520, currency_code: "eur" }] },
                { title: "Medium", sku: "KAF-BRG-M", options: { Size: "M" }, prices: [{ amount: 520, currency_code: "eur" }] },
                { title: "Large", sku: "KAF-BRG-L", options: { Size: "L" }, prices: [{ amount: 520, currency_code: "eur" }] },
                { title: "Extra Large", sku: "KAF-BRG-XL", options: { Size: "XL" }, prices: [{ amount: 550, currency_code: "eur" }] },
            ],
            sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
            title: "Traditional Cream Djellaba",
            handle: "cream-cotton-djellaba",
            description: "Classic cream cotton Djellaba with geometric embroidery.",
            category_ids: [djellabaCategory?.id || kaftanCategory.id],
            weight: 500,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: "/products/djellaba-cream.png" }],
            thumbnail: "/products/djellaba-cream.png",
            options: [{ title: "Size", values: ["M", "L", "XL"] }],
            variants: [
                { title: "Medium", sku: "DJL-CRM-M", options: { Size: "M" }, prices: [{ amount: 180, currency_code: "eur" }] },
                { title: "Large", sku: "DJL-CRM-L", options: { Size: "L" }, prices: [{ amount: 180, currency_code: "eur" }] },
                { title: "Extra Large", sku: "DJL-CRM-XL", options: { Size: "XL" }, prices: [{ amount: 190, currency_code: "eur" }] },
            ],
            sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
            title: "Navy Wool Djellaba",
            handle: "navy-wool-djellaba",
            description: "Premium navy blue wool Djellaba with white embroidery.",
            category_ids: [djellabaCategory?.id || kaftanCategory.id],
            weight: 600,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: "/products/djellaba-navy.png" }],
            thumbnail: "/products/djellaba-navy.png",
            options: [{ title: "Size", values: ["M", "L", "XL"] }],
            variants: [
                { title: "Medium", sku: "DJL-NVY-M", options: { Size: "M" }, prices: [{ amount: 250, currency_code: "eur" }] },
                { title: "Large", sku: "DJL-NVY-L", options: { Size: "L" }, prices: [{ amount: 250, currency_code: "eur" }] },
                { title: "Extra Large", sku: "DJL-NVY-XL", options: { Size: "XL" }, prices: [{ amount: 260, currency_code: "eur" }] },
            ],
            sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
            title: "Golden Bridal Takchita",
            handle: "golden-bridal-takchita",
            description: "Stunning ceremonial Takchita in golden champagne satin.",
            category_ids: [takchitaCategory?.id || kaftanCategory.id],
            weight: 1000,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: "/products/takchita-gold.png" }],
            thumbnail: "/products/takchita-gold.png",
            options: [{ title: "Size", values: ["S", "M", "L"] }],
            variants: [
                { title: "Small", sku: "TAK-GLD-S", options: { Size: "S" }, prices: [{ amount: 1200, currency_code: "eur" }] },
                { title: "Medium", sku: "TAK-GLD-M", options: { Size: "M" }, prices: [{ amount: 1200, currency_code: "eur" }] },
                { title: "Large", sku: "TAK-GLD-L", options: { Size: "L" }, prices: [{ amount: 1250, currency_code: "eur" }] },
            ],
            sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
            title: "Classic White Jabador",
            handle: "white-cotton-jabador",
            description: "Elegant white cotton Jabador with delicate embroidery.",
            category_ids: [jabadorCategory?.id || kaftanCategory.id],
            weight: 450,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [{ url: "/products/jabador-white.png" }],
            thumbnail: "/products/jabador-white.png",
            options: [{ title: "Size", values: ["M", "L", "XL"] }],
            variants: [
                { title: "Medium", sku: "JAB-WHT-M", options: { Size: "M" }, prices: [{ amount: 150, currency_code: "eur" }] },
                { title: "Large", sku: "JAB-WHT-L", options: { Size: "L" }, prices: [{ amount: 150, currency_code: "eur" }] },
                { title: "Extra Large", sku: "JAB-WHT-XL", options: { Size: "XL" }, prices: [{ amount: 160, currency_code: "eur" }] },
            ],
            sales_channels: [{ id: defaultSalesChannel.id }],
        },
    ];

    // N-filtriw li deja kaynin
    const productsToCreate = newProducts.filter(p => !existingHandles.includes(p.handle));

    if (productsToCreate.length === 0) {
        logger.info("All products already exist.");
        return;
    }

    logger.info(`Creating ${productsToCreate.length} new products...`);

    try {
        const { result: productResult } = await createProductsWorkflow(container).run({
            input: { products: productsToCreate },
        });

        logger.info(`✅ Created ${productResult.length} products`);

        await linkSalesChannelsToProductsWorkflow(container).run({
            input: {
                sales_channel_id: defaultSalesChannel.id,
                products_ids: productResult.map((p: any) => p.id),
            },
        });

        logger.info("✅ Linked to Sales Channel");
        logger.info("🎉 Products added successfully!");
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
    }
}
