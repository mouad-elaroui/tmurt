import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WALLET_MODULE } from "../../../../modules/wallet"
import { WalletService } from "../../../../modules/wallet/service"

// POST /store/wallet/use - Use wallet balance for payment
// Hna fin kan-khedmo l-wallet bach n-khellso
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const walletService: WalletService = req.scope.resolve(WALLET_MODULE)

        // Get customer ID from auth context
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id

        if (!customerId) {
            res.status(401).json({
                message: "Authentication required"
            })
            return
        }

        const { amount, cart_id, order_id } = req.body as {
            amount: number
            cart_id?: string
            order_id?: string
        }

        if (!amount || amount <= 0) {
            res.status(400).json({
                message: "Valid amount is required"
            })
            return
        }

        // Find wallet by customer ID
        const [wallets] = await walletService.listAndCountWallets({
            customer_id: customerId
        })

        if (wallets.length === 0) {
            res.status(404).json({
                message: "Wallet not found for this customer"
            })
            return
        }

        const wallet = wallets[0]
        const currentBalance = Number(wallet.balance) || 0

        if (currentBalance < amount) {
            res.status(400).json({
                message: "Insufficient wallet balance",
                available_balance: currentBalance,
                requested_amount: amount
            })
            return
        }

        // Deduct amount from wallet
        const newBalance = currentBalance - amount
        await walletService.updateWallets({
            id: wallet.id,
            balance: newBalance,
        })

        res.json({
            success: true,
            message: "Wallet payment successful",
            amount_used: amount,
            previous_balance: currentBalance,
            new_balance: newBalance,
            currency_code: wallet.currency_code || "MAD"
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error"
        console.error("Error using wallet:", message)
        res.status(500).json({
            message: "Error processing wallet payment",
            error: message
        })
    }
}
