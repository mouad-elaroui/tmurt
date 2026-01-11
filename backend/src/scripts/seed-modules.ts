// seed wallet, sizing, passport demo data

import { ExecArgs } from "@medusajs/framework/types"
import { WALLET_MODULE } from "../modules/wallet"
import { SIZING_MODULE } from "../modules/sizing"
import { DIGITAL_PASSPORT_MODULE } from "../modules/digital-passport"

interface WalletData {
    customer_id: string
    balance: number
    currency_code: string
    metadata?: Record<string, string>
}

interface SizingData {
    customer_id: string
    recommended_size: string
    chest: number
    waist: number
    hips: number
    height: number
}

interface PassportData {
    token_id: string
    order_id: string
    status: string
    metadata?: Record<string, string>
}

const DEMO_CUSTOMERS = [
    "cus_01DEMO0001",
    "cus_01DEMO0002",
    "cus_01DEMO0003",
    "cus_01DEMO0004",
    "cus_01DEMO0005",
]

export default async function seedModules({ container }: ExecArgs): Promise<void> {
    const walletService = container.resolve(WALLET_MODULE)
    const sizingService = container.resolve(SIZING_MODULE)
    const passportService = container.resolve(DIGITAL_PASSPORT_MODULE)

    console.log("=== SEED MODULES ===\n")

    // wallets
    const wallets: WalletData[] = [
        { customer_id: DEMO_CUSTOMERS[0], balance: 500, currency_code: "MAD", metadata: { source: "signup" } },
        { customer_id: DEMO_CUSTOMERS[1], balance: 1250, currency_code: "MAD", metadata: { source: "referral" } },
        { customer_id: DEMO_CUSTOMERS[2], balance: 75, currency_code: "MAD", metadata: { source: "refund" } },
        { customer_id: DEMO_CUSTOMERS[3], balance: 2000, currency_code: "MAD", metadata: { source: "gift" } },
        { customer_id: DEMO_CUSTOMERS[4], balance: 0, currency_code: "MAD" },
    ]

    console.log("Wallets...")
    await Promise.all(
        wallets.map(async (w) => {
            try {
                await walletService.createWallets(w)
                console.log(`  [OK] ${w.customer_id}: ${w.balance} MAD`)
            } catch {
                console.log(`  [SKIP] ${w.customer_id}`)
            }
        })
    )

    // sizing
    const sizing: SizingData[] = [
        { customer_id: DEMO_CUSTOMERS[0], recommended_size: "M", chest: 98, waist: 82, hips: 95, height: 175 },
        { customer_id: DEMO_CUSTOMERS[1], recommended_size: "L", chest: 106, waist: 90, hips: 105, height: 180 },
        { customer_id: DEMO_CUSTOMERS[2], recommended_size: "S", chest: 92, waist: 75, hips: 88, height: 168 },
        { customer_id: DEMO_CUSTOMERS[3], recommended_size: "XL", chest: 115, waist: 98, hips: 110, height: 185 },
        { customer_id: DEMO_CUSTOMERS[4], recommended_size: "XS", chest: 85, waist: 70, hips: 82, height: 162 },
    ]

    console.log("\nSizing...")
    await Promise.all(
        sizing.map(async (s) => {
            try {
                await sizingService.createSizingDatas(s)
                console.log(`  [OK] ${s.customer_id}: ${s.recommended_size}`)
            } catch {
                console.log(`  [SKIP] ${s.customer_id}`)
            }
        })
    )

    // passports
    const passports: PassportData[] = [
        { token_id: "TMURT-001-DJELLABA", order_id: "order_demo001", status: "active", metadata: { product: "Djellaba" } },
        { token_id: "TMURT-002-KAFTAN", order_id: "order_demo002", status: "verified", metadata: { product: "Kaftan" } },
        { token_id: "TMURT-003-TAKCHITA", order_id: "order_demo003", status: "active", metadata: { product: "Takchita" } },
        { token_id: "TMURT-004-JABADOR", order_id: "order_demo004", status: "active", metadata: { product: "Jabador" } },
        { token_id: "TMURT-005-BABOUCHE", order_id: "order_demo005", status: "revoked", metadata: { product: "Babouche" } },
    ]

    console.log("\nPassports...")
    await Promise.all(
        passports.map(async (p) => {
            try {
                await passportService.createDigitalPassports(p)
                console.log(`  [OK] ${p.token_id}`)
            } catch {
                console.log(`  [SKIP] ${p.token_id}`)
            }
        })
    )

    console.log("\n=== DONE ===")
    console.log(`Wallets: ${wallets.length}, Sizing: ${sizing.length}, Passports: ${passports.length}`)
}
