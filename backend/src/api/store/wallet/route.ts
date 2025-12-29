import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WALLET_MODULE } from "../../../modules/wallet"
import { WalletService } from "../../../modules/wallet/service"

// GET /store/wallet - Get customer's wallet balance
// Hna fin kan-jebdo l-balance dial l-wallet dial l-customer
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const walletService: WalletService = req.scope.resolve(WALLET_MODULE)

        // Get customer ID from auth context
        const customerId = (req as any).auth_context?.actor_id

        if (!customerId) {
            res.status(401).json({
                message: "Authentication required",
                wallet: null
            })
            return
        }

        // Find wallet by customer ID
        const [wallets] = await walletService.listAndCountWallets({
            customer_id: customerId
        })

        if (wallets.length === 0) {
            // Return empty wallet state if none exists
            res.json({
                wallet: null,
                balance: 0,
                currency_code: "MAD",
                formatted_balance: "0.00 MAD"
            })
            return
        }

        const wallet = wallets[0]
        const balance = Number(wallet.balance) || 0

        res.json({
            wallet: {
                id: wallet.id,
                customer_id: wallet.customer_id,
                balance: balance,
                currency_code: wallet.currency_code || "MAD",
            },
            balance: balance,
            currency_code: wallet.currency_code || "MAD",
            formatted_balance: `${balance.toFixed(2)} ${wallet.currency_code || "MAD"}`
        })
    } catch (error: any) {
        console.error("Error fetching wallet:", error)
        res.status(500).json({
            message: "Error fetching wallet",
            error: error.message
        })
    }
}
