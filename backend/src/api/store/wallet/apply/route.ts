import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /store/wallet/apply - Apply wallet credit l-checkout
// Hna fin l-customer ykhelles b l-wallet dyalo
export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        // Khass l-customer ykon logged in
        const customerId = req.auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach tsta3mel l-wallet"
            })
        }

        const { cart_id, amount } = req.body as { cart_id: string; amount?: number }

        if (!cart_id) {
            return res.status(400).json({
                error: "Cart ID required",
                message: "Khass cart_id"
            })
        }

        const walletService = req.scope.resolve("walletService") as any

        // Jbed l-current balance
        const balance = await walletService.getBalance(customerId)

        if (balance <= 0) {
            return res.json({
                applied: false,
                amount_applied: 0,
                remaining_balance: 0,
                message: "Ma 3ndekch flous f l-wallet"
            })
        }

        // Hna fin kan-applikyiw l-wallet credit
        const result = await walletService.applyToCheckout(
            customerId,
            amount ?? balance, // Use specified amount or full balance
            cart_id
        )

        return res.json({
            ...result,
            message: result.applied
                ? `Applied ${result.amount_applied} MAD from wallet`
                : "Wallet not applied"
        })
    } catch (error: any) {
        console.error("[Wallet Apply] Error:", error)
        return res.status(500).json({
            error: error.message || "Failed to apply wallet",
            message: "Ma qderch n-appliki l-wallet, 3awed mn b3d"
        })
    }
}
