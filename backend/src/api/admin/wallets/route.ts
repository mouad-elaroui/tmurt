
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WALLET_MODULE } from "../../../modules/wallet"
import { WalletService } from "../../../modules/wallet/service"

// GET /admin/wallets - List all wallets
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const walletService: WalletService = req.scope.resolve(WALLET_MODULE)
    // Hna kan-jebdo la liste dial l-wallets kamlin
    const [wallets, count] = await walletService.listAndCountWallets(req.query)

    res.json({
        wallets,
        count,
        offset: 0,
        limit: 10,
    })
}

// POST /admin/wallets - Credit a customer wallet
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const walletService: WalletService = req.scope.resolve(WALLET_MODULE)

        const { customer_id, amount, currency_code } = req.body as {
            customer_id: string
            amount: number
            currency_code?: string
        }

        if (!customer_id || !amount) {
            res.status(400).json({
                message: "customer_id and amount are required"
            })
            return
        }

        // Credit l-wallet dial l-customer
        const result = await walletService.creditWallet(
            customer_id,
            amount,
            currency_code || "MAD"
        )

        res.json({
            success: true,
            message: "Wallet credited successfully",
            ...result
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json({
            message: "Error crediting wallet",
            error: message
        })
    }
}
