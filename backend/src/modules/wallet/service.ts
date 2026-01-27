import { MedusaService } from "@medusajs/framework/utils"
import { Wallet } from "./models/wallet"

// Service l-khas b l-wallet operations
export class WalletService extends MedusaService({
    Wallet,
}) {
    // Jbed l-wallet dial customer, wla khelqo ila ma kaynch
    async getOrCreateWallet(customerId: string, currencyCode: string = "MAD") {
        const [wallets] = await this.listAndCountWallets({
            customer_id: customerId
        })

        if (wallets.length > 0) {
            return wallets[0]
        }

        // Crear wallet jdid l-customer
        const wallet = await this.createWallets({
            customer_id: customerId,
            currency_code: currencyCode,
            balance: 0,
        })

        return wallet
    }

    // Zid flous l-wallet (credit)
    async creditWallet(customerId: string, amount: number, currencyCode: string = "MAD") {
        if (amount <= 0) {
            throw new Error("Amount must be positive")
        }

        const wallet = await this.getOrCreateWallet(customerId, currencyCode)
        const currentBalance = Number(wallet.balance) || 0
        const newBalance = currentBalance + amount

        await this.updateWallets({
            id: wallet.id,
            balance: newBalance,
        })

        return {
            wallet_id: wallet.id,
            previous_balance: currentBalance,
            amount_credited: amount,
            new_balance: newBalance,
            currency_code: wallet.currency_code,
        }
    }

    // Nqes flous mn l-wallet (debit)
    async debitWallet(customerId: string, amount: number) {
        if (amount <= 0) {
            throw new Error("Amount must be positive")
        }

        const [wallets] = await this.listAndCountWallets({
            customer_id: customerId
        })

        if (wallets.length === 0) {
            throw new Error("Wallet not found")
        }

        const wallet = wallets[0]
        const currentBalance = Number(wallet.balance) || 0

        if (currentBalance < amount) {
            throw new Error("Insufficient balance")
        }

        const newBalance = currentBalance - amount

        await this.updateWallets({
            id: wallet.id,
            balance: newBalance,
        })

        return {
            wallet_id: wallet.id,
            previous_balance: currentBalance,
            amount_debited: amount,
            new_balance: newBalance,
            currency_code: wallet.currency_code,
        }
    }

    // Jbed l-balance dial l-wallet
    async getBalance(customerId: string): Promise<number> {
        const [wallets] = await this.listAndCountWallets({
            customer_id: customerId
        })

        return wallets.length > 0 ? Number(wallets[0].balance) || 0 : 0
    }
}
