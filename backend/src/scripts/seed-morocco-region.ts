import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
} from "@medusajs/framework/utils";
import {
    createRegionsWorkflow,
    createShippingOptionsWorkflow,
    createTaxRegionsWorkflow,
    updateStoresWorkflow,
    linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

// Seed script to create Morocco region with MAD currency
export default async function seedMoroccoRegion({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const storeModuleService = container.resolve(Modules.STORE);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const link = container.resolve(ContainerRegistrationKeys.LINK);

    logger.info("🇲🇦 Setting up Morocco region...");

    // Get the store
    const [store] = await storeModuleService.listStores();

    // Add MAD currency to supported currencies
    logger.info("Adding MAD currency to store...");
    await updateStoresWorkflow(container).run({
        input: {
            selector: { id: store.id },
            update: {
                supported_currencies: [
                    { currency_code: "eur", is_default: false },
                    { currency_code: "usd", is_default: false },
                    { currency_code: "mad", is_default: true }, // Moroccan Dirham as default
                ],
            },
        },
    });

    // Create Morocco region
    logger.info("Creating Morocco region...");
    const { result: regionResult } = await createRegionsWorkflow(container).run({
        input: {
            regions: [
                {
                    name: "Morocco",
                    currency_code: "mad",
                    countries: ["ma"], // Morocco country code
                    payment_providers: ["pp_system_default"],
                },
            ],
        },
    });
    const moroccoRegion = regionResult[0];
    logger.info(`Created Morocco region with ID: ${moroccoRegion.id}`);

    // Create tax region for Morocco
    logger.info("Creating tax region for Morocco...");
    await createTaxRegionsWorkflow(container).run({
        input: [
            {
                country_code: "ma",
                provider_id: "tp_system",
            },
        ],
    });

    // Get or create fulfillment set for Morocco
    logger.info("Setting up shipping for Morocco...");

    // Get existing shipping profile
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });

    if (!shippingProfiles.length) {
        logger.error("No shipping profile found. Please run the main seed first.");
        return;
    }
    const shippingProfile = shippingProfiles[0];

    // Get existing stock location
    const stockLocations = await container.resolve(Modules.STOCK_LOCATION).listStockLocations({});

    if (!stockLocations.length) {
        logger.info("Creating Morocco warehouse...");
        // Create a stock location for Morocco
        const stockLocationService = container.resolve(Modules.STOCK_LOCATION);
        const moroccoWarehouse = await stockLocationService.createStockLocations({
            name: "Morocco Warehouse - Casablanca",
            address: {
                city: "Casablanca",
                country_code: "MA",
                address_1: "Boulevard Mohammed V",
            },
        });

        await link.create({
            [Modules.STOCK_LOCATION]: {
                stock_location_id: moroccoWarehouse.id,
            },
            [Modules.FULFILLMENT]: {
                fulfillment_provider_id: "manual_manual",
            },
        });
    }

    // Create fulfillment set for Morocco
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "Morocco Delivery",
        type: "shipping",
        service_zones: [
            {
                name: "Morocco",
                geo_zones: [
                    {
                        country_code: "ma",
                        type: "country",
                    },
                ],
            },
        ],
    });

    // Link stock location to fulfillment set
    const stockLocation = stockLocations.length ? stockLocations[0] : null;
    if (stockLocation) {
        await link.create({
            [Modules.STOCK_LOCATION]: {
                stock_location_id: stockLocation.id,
            },
            [Modules.FULFILLMENT]: {
                fulfillment_set_id: fulfillmentSet.id,
            },
        });
    }

    // Create shipping options for Morocco
    await createShippingOptionsWorkflow(container).run({
        input: [
            {
                name: "Livraison Standard",
                price_type: "flat",
                provider_id: "manual_manual",
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: "Standard",
                    description: "Livraison en 3-5 jours",
                    code: "standard-ma",
                },
                prices: [
                    {
                        currency_code: "mad",
                        amount: 30, // 30 MAD
                    },
                    {
                        region_id: moroccoRegion.id,
                        amount: 30,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            },
            {
                name: "Livraison Express",
                price_type: "flat",
                provider_id: "manual_manual",
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: "Express",
                    description: "Livraison en 24 heures",
                    code: "express-ma",
                },
                prices: [
                    {
                        currency_code: "mad",
                        amount: 60, // 60 MAD
                    },
                    {
                        region_id: moroccoRegion.id,
                        amount: 60,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            },
        ],
    });

    logger.info("✅ Morocco region setup complete!");
    logger.info("- Morocco region with MAD currency");
    logger.info("- Tax region for MA");
    logger.info("- Shipping options: Standard (30 MAD) and Express (60 MAD)");
}
