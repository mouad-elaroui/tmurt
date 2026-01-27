import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/wallet/me - Jbed l-wallet details w transaction history
// Hna l-endpoint li ghadi ysta3mel l-Golden Card
export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        // Khass l-customer ykon logged in
        const customerId = req.auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach tchouf l-wallet dyalek"
            })
        }

        const walletService = req.scope.resolve("walletService") as any

        // Jbed l-wallet details
        const walletDetails = await walletService.getWalletDetails(customerId)

        // Ila ma kaynch wallet, rje3 null
        if (!walletDetails) {
            return res.json({
                wallet: null,
                transactions: [],
                message: "No wallet found - will be created on first credit"
            })
        }

        // Jbed l-transaction history
        const transactions = await walletService.getTransactionHistory(customerId, 20)

        return res.json({
            wallet: {
                id: walletDetails.id,
                balance: walletDetails.balance,
                currency_code: walletDetails.currency_code,
            },
            transactions: transactions,
        })
    } catch (error) {
        console.error("[Wallet Me] Error:", error)
        return res.status(500).json({
            error: "Failed to fetch wallet",
            message: "Ma qderch njbed l-wallet, 3awed mn b3d"
        })
    }
}
