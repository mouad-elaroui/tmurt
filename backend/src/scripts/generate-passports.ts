import { ExecArgs } from "@medusajs/framework/types"
import { DIGITAL_PASSPORT_MODULE } from "../modules/digital-passport"
import { DigitalPassportService } from "../modules/digital-passport/service"

// Script li kay-generer digital passports l-ga3 les orders
// Hada kay-mettel l-authenticité dial l-produits l-clients
export default async function generatePassports({ container }: ExecArgs) {
    console.log("🛂 Starting Digital Passport Generation...")

    const digitalPassportService: DigitalPassportService = container.resolve(
        DIGITAL_PASSPORT_MODULE
    )

    // Get all orders from the order module
    const query = container.resolve("query")

    try {
        // List all orders
        const { data: orders } = await query.graph({
            entity: "order",
            fields: ["id", "display_id", "status", "created_at"],
        })

        console.log(`📦 Found ${orders.length} orders`)

        let created = 0
        let existing = 0

        for (const order of orders) {
            try {
                // Check if passport already exists
                const existingPassport = await digitalPassportService.getPassportByOrder(order.id)

                if (existingPassport) {
                    console.log(`✓ Order #${order.display_id}: Passport exists (${existingPassport.token_id})`)
                    existing++
                } else {
                    // Create new passport
                    const passport = await digitalPassportService.createPassport(order.id, {
                        display_id: order.display_id,
                        order_status: order.status,
                    })
                    console.log(`✨ Order #${order.display_id}: Created passport (${passport.token_id})`)
                    created++
                }
            } catch (error) {
                console.error(`❌ Order #${order.display_id}: Failed - ${error}`)
            }
        }

        console.log("\n📊 Summary:")
        console.log(`   - New passports created: ${created}`)
        console.log(`   - Existing passports: ${existing}`)
        console.log(`   - Total orders: ${orders.length}`)
        console.log("\n✅ Digital Passport Generation Complete!")

    } catch (error) {
        console.error("❌ Error fetching orders:", error)

        // Fallback: Try to create passport for the known order ID
        console.log("\n🔄 Trying fallback with known order ID...")
        const knownOrderId = "order_01KFV6783DR83Z5MHDXW8DFHVV"

        try {
            const passport = await digitalPassportService.createPassport(knownOrderId, {
                source: "manual_generation",
                created_by: "generate-passports script"
            })
            console.log(`✨ Created passport for known order: ${passport.token_id}`)
        } catch (e) {
            console.error("❌ Fallback also failed:", e)
        }
    }
}
