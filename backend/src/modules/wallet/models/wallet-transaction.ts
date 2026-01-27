import { model } from "@medusajs/framework/utils"

// Transaction dial l-wallet - kol operation credit/debit
export const WalletTransaction = model.define("wallet_transaction", {
    id: model.id().primaryKey(),
    wallet_id: model.text().searchable(),
    amount: model.bigNumber(), // L-mblagh dial l-transaction
    type: model.text(), // "CREDIT" wla "DEBIT"
    reference_id: model.text().nullable(), // Order ID wla reference akhor
    description: model.text().nullable(), // Chno daret had l-transaction
    metadata: model.json().nullable(),
})
// Hna kanstoriw kol transaction bach n-trackiw l-history
