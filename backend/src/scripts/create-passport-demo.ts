import { ExecArgs } from "@medusajs/framework/types"
import { DIGITAL_PASSPORT_MODULE } from "../modules/digital-passport"
import { DigitalPassportService } from "../modules/digital-passport/service"

// Script li kay-creer passport l-order dial demo
export default async function createDemoPassport({ container }: ExecArgs) {
    console.log("🛂 Creating Demo Passport...")

    const digitalPassportService: DigitalPassportService = container.resolve(
        DIGITAL_PASSPORT_MODULE
    )

    // Order ID li kenna dir f checkout
    const orderId = "order_01KFV6783DR83Z5MHDXW8DFHVV"

    try {
        // Create passport
        const passport = await digitalPassportService.createPassport(orderId, {
            display_id: "1",
            source: "demo_script",
            product_authenticity: "verified"
        })

        console.log("\n✅ Passport Created Successfully!")
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        console.log(`📋 Passport ID: ${passport.id}`)
        console.log(`🔑 Token ID: ${passport.token_id}`)
        console.log(`📦 Order ID: ${passport.order_id}`)
        console.log(`🔗 Verification: https://tmurt.ma/verify/${passport.token_id}`)
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

        // Verify it was created
        const verified = await digitalPassportService.getPassportByOrder(orderId)
        console.log(`✓ Verification: Passport found = ${verified ? 'YES' : 'NO'}`)

    } catch (error) {
        console.error("❌ Error creating passport:", error)
    }
}
