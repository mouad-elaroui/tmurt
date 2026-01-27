import { MedusaService } from "@medusajs/framework/utils"
import { Wallet } from "./models/wallet"
import { WalletTransaction } from "./models/wallet-transaction"

// Service l-khas b l-wallet operations w transactions
export class WalletService extends MedusaService({
    Wallet,
    WalletTransaction,
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

    // Zid flous l-wallet (credit) w log transaction
    async creditWallet(
        customerId: string,
        amount: number,
        currencyCode: string = "MAD",
        referenceId?: string,
        description?: string
    ) {
        if (amount <= 0) {
            throw new Error("Amount must be positive")
        }

        const wallet = await this.getOrCreateWallet(customerId, currencyCode)
        const currentBalance = Number(wallet.balance) || 0
        const newBalance = currentBalance + amount

        // Update l-balance
        await this.updateWallets({
            id: wallet.id,
            balance: newBalance,
        })

        // Log transaction - hna kan-storiw l-history
        await this.createWalletTransactions({
            wallet_id: wallet.id,
            amount: amount,
            type: "CREDIT",
            reference_id: referenceId ?? null,
            description: description ?? "Wallet credit",
            metadata: {
                previous_balance: currentBalance,
                new_balance: newBalance,
                timestamp: new Date().toISOString(),
            },
        })

        return {
            wallet_id: wallet.id,
            previous_balance: currentBalance,
            amount_credited: amount,
            new_balance: newBalance,
            currency_code: wallet.currency_code,
        }
    }

    // Nqes flous mn l-wallet (debit) w log transaction
    async debitWallet(
        customerId: string,
        amount: number,
        referenceId?: string,
        description?: string
    ) {
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

        // Khass n-verifiyiw wach l-balance kafi
        if (currentBalance < amount) {
            throw new Error("Insufficient balance")
        }

        const newBalance = currentBalance - amount

        // Update l-balance
        await this.updateWallets({
            id: wallet.id,
            balance: newBalance,
        })

        // Log transaction - hna kan-storiw l-debit
        await this.createWalletTransactions({
            wallet_id: wallet.id,
            amount: amount,
            type: "DEBIT",
            reference_id: referenceId ?? null,
            description: description ?? "Wallet debit",
            metadata: {
                previous_balance: currentBalance,
                new_balance: newBalance,
                timestamp: new Date().toISOString(),
            },
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

    // Jbed l-wallet m3a l-balance w l-currency
    async getWalletDetails(customerId: string) {
        const [wallets] = await this.listAndCountWallets({
            customer_id: customerId
        })

        if (wallets.length === 0) {
            return null
        }

        const wallet = wallets[0]
        return {
            id: wallet.id,
            balance: Number(wallet.balance) || 0,
            currency_code: wallet.currency_code,
        }
    }

    // Jbed l-history dial l-transactions - hna fin kan-affichy l-Golden Card
    async getTransactionHistory(customerId: string, limit: number = 20) {
        const [wallets] = await this.listAndCountWallets({
            customer_id: customerId
        })

        if (wallets.length === 0) {
            return []
        }

        const wallet = wallets[0]

        // Jbed transactions dial had l-wallet
        const [transactions] = await this.listAndCountWalletTransactions(
            { wallet_id: wallet.id },
            { take: limit, order: { created_at: "DESC" } }
        )

        return transactions.map(t => ({
            id: t.id,
            amount: Number(t.amount) || 0,
            type: t.type,
            description: t.description,
            reference_id: t.reference_id,
            created_at: (t.metadata as { timestamp?: string })?.timestamp ?? null,
        }))
    }

    // Apply wallet credit l-checkout - nkhelsu b l-wallet
    async applyToCheckout(customerId: string, cartTotal: number, cartId: string) {
        const balance = await this.getBalance(customerId)

        // Hna fin kan-calculiw ch-hal ghadi nstakhdem mn l-wallet
        const amountToApply = Math.min(balance, cartTotal)

        if (amountToApply <= 0) {
            return {
                applied: false,
                amount_applied: 0,
                remaining_balance: balance,
                remaining_cart_total: cartTotal,
            }
        }

        // Debit l-amount dial l-cart
        await this.debitWallet(
            customerId,
            amountToApply,
            cartId,
            `Checkout payment for cart ${cartId}`
        )

        return {
            applied: true,
            amount_applied: amountToApply,
            remaining_balance: balance - amountToApply,
            remaining_cart_total: cartTotal - amountToApply,
        }
    }
}
