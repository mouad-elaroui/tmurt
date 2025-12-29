/**
 * Seed Script for Custom Modules - Wallet, Sizing, Digital Passport
 * Script dial seeding l-modules l-customized: Wallet, Sizing, Digital Passport
 * 
 * Run with: npx medusa exec ./src/scripts/seed-custom-modules.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import { WALLET_MODULE } from "../modules/wallet"
import { SIZING_MODULE } from "../modules/sizing"
import { DIGITAL_PASSPORT_MODULE } from "../modules/digital-passport"

export default async function seedCustomModules({ container }: ExecArgs) {
    console.log("🌱 Starting custom modules seeding...")

    // Get services
    const walletService = container.resolve(WALLET_MODULE)
    const sizingService = container.resolve(SIZING_MODULE)
    const passportService = container.resolve(DIGITAL_PASSPORT_MODULE)

    // Sample customer IDs (these should match existing customers in your DB)
    // If you don't have customers, you can use placeholder IDs for testing
    const sampleCustomerIds = [
        "cus_01DEMO0001WALLET",
        "cus_01DEMO0002WALLET",
        "cus_01DEMO0003WALLET",
        "cus_01DEMO0004WALLET",
        "cus_01DEMO0005WALLET",
    ]

    // ========================================
    // 1. SEED WALLETS - L-Wallets dial l-clients
    // ========================================
    console.log("\n💰 Seeding wallets...")

    const walletData = [
        { customer_id: sampleCustomerIds[0], balance: 500, currency_code: "MAD", metadata: { source: "signup_bonus" } },
        { customer_id: sampleCustomerIds[1], balance: 1250.50, currency_code: "MAD", metadata: { source: "referral" } },
        { customer_id: sampleCustomerIds[2], balance: 75, currency_code: "MAD", metadata: { source: "refund" } },
        { customer_id: sampleCustomerIds[3], balance: 2000, currency_code: "MAD", metadata: { source: "gift_card" } },
        { customer_id: sampleCustomerIds[4], balance: 0, currency_code: "MAD", metadata: { source: "empty" } },
    ]

    for (const wallet of walletData) {
        try {
            await walletService.createWallets(wallet)
            console.log(`  ✅ Created wallet for ${wallet.customer_id} with ${wallet.balance} ${wallet.currency_code}`)
        } catch (e: any) {
            console.log(`  ⚠️ Wallet may already exist for ${wallet.customer_id}: ${e.message}`)
        }
    }

    // ========================================
    // 2. SEED SIZING DATA - L-Donnees dial l-taille
    // ========================================
    console.log("\n📏 Seeding sizing data...")

    const sizingData = [
        { customer_id: sampleCustomerIds[0], recommended_size: "M", chest: 98, waist: 82, hips: 95, height: 175 },
        { customer_id: sampleCustomerIds[1], recommended_size: "L", chest: 106, waist: 90, hips: 105, height: 180 },
        { customer_id: sampleCustomerIds[2], recommended_size: "S", chest: 92, waist: 75, hips: 88, height: 168 },
        { customer_id: sampleCustomerIds[3], recommended_size: "XL", chest: 115, waist: 98, hips: 110, height: 185 },
        { customer_id: sampleCustomerIds[4], recommended_size: "XS", chest: 85, waist: 70, hips: 82, height: 162 },
        // More varied data for chart visualization
        { customer_id: "cus_01EXTRA_SIZE_01", recommended_size: "M", chest: 100, waist: 84, hips: 98, height: 176 },
        { customer_id: "cus_01EXTRA_SIZE_02", recommended_size: "M", chest: 99, waist: 83, hips: 96, height: 174 },
        { customer_id: "cus_01EXTRA_SIZE_03", recommended_size: "L", chest: 108, waist: 92, hips: 106, height: 182 },
        { customer_id: "cus_01EXTRA_SIZE_04", recommended_size: "S", chest: 90, waist: 74, hips: 86, height: 166 },
        { customer_id: "cus_01EXTRA_SIZE_05", recommended_size: "XXL", chest: 128, waist: 110, hips: 120, height: 190 },
    ]

    for (const sizing of sizingData) {
        try {
            await sizingService.createSizingDatas(sizing)
            console.log(`  ✅ Created sizing data for ${sizing.customer_id}: ${sizing.recommended_size}`)
        } catch (e: any) {
            console.log(`  ⚠️ Sizing data may already exist for ${sizing.customer_id}: ${e.message}`)
        }
    }

    // ========================================
    // 3. SEED DIGITAL PASSPORTS - L-Passports digitaux
    // ========================================
    console.log("\n🎫 Seeding digital passports...")

    const passportData = [
        {
            token_id: "TMURT-ORD001-DJELLABA",
            order_id: "order_01DEMO0001PASS",
            status: "active",
            metadata: { product: "Djellaba Homme", issued_date: new Date().toISOString() }
        },
        {
            token_id: "TMURT-ORD002-KAFTAN",
            order_id: "order_01DEMO0002PASS",
            status: "verified",
            metadata: { product: "Kaftan Femme", issued_date: new Date().toISOString() }
        },
        {
            token_id: "TMURT-ORD003-TAKCHITA",
            order_id: "order_01DEMO0003PASS",
            status: "active",
            metadata: { product: "Takchita Mariage", issued_date: new Date().toISOString() }
        },
        {
            token_id: "TMURT-ORD004-JABADOR",
            order_id: "order_01DEMO0004PASS",
            status: "active",
            metadata: { product: "Jabador Enfant", issued_date: new Date().toISOString() }
        },
        {
            token_id: "TMURT-ORD005-BABOUCHE",
            order_id: "order_01DEMO0005PASS",
            status: "revoked",
            metadata: { product: "Babouches Cuir", issued_date: new Date().toISOString(), revoked_reason: "Order cancelled" }
        },
    ]

    for (const passport of passportData) {
        try {
            await passportService.createDigitalPassports(passport)
            console.log(`  ✅ Created passport ${passport.token_id} (${passport.status})`)
        } catch (e: any) {
            console.log(`  ⚠️ Passport may already exist for ${passport.token_id}: ${e.message}`)
        }
    }

    console.log("\n✨ Custom modules seeding complete!")
    console.log("📊 Summary:")
    console.log(`   - Wallets: ${walletData.length} records`)
    console.log(`   - Sizing: ${sizingData.length} records`)
    console.log(`   - Passports: ${passportData.length} records`)
    console.log("\n🔍 Check your admin dashboard to see the data!")
}
