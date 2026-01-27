import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow, linkProductsToSalesChannelWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedQuick({ container }: ExecArgs): Promise<void> {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    const shippingProfileService = container.resolve(Modules.FULFILLMENT)

    logger.info("Starting Quick Seed...")

    // Get SC
    const [salesChannel] = await salesChannelService.listSalesChannels({ name: "Default Sales Channel" })
    if (!salesChannel) throw new Error("No SC")

    // Get Shipping Profile
    const [shippingProfile] = await shippingProfileService.listShippingProfiles({ type: "default" })
    if (!shippingProfile) throw new Error("No SP")

    logger.info("Creating 1 Product...")

    const { result: products } = await createProductsWorkflow(container).run({
        input: {
            products: [{
                title: "Emergency Djellaba",
                handle: "emergency-djellaba",
                description: "Restoring system data",
                weight: 500,
                status: ProductStatus.PUBLISHED,
                shipping_profile_id: shippingProfile.id,
                sales_channels: [{ id: salesChannel.id }]
            }]
        }
    })

    await linkProductsToSalesChannelWorkflow(container).run({
        input: {
            id: salesChannel.id,
            add: products.map(p => p.id)
        }
    })

    logger.info(`Created ${products.length} product(s)`)
}
