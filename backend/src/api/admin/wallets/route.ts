
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WALLET_MODULE } from "../../../modules/wallet"
import { WalletService } from "../../../modules/wallet/service"

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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    // Logic bach n-creer wallet (optional for admin, usually auto-created)
    res.json({ message: "Not implemented yet" })
}
