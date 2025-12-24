import { model } from "@medusajs/framework/utils"

export const Wallet = model.define("wallet", {
    id: model.id().primaryKey(),
    customer_id: model.text().searchable(),
    currency_code: model.text(),
    balance: model.bigNumber().default(0), // L-solde l-hali dial l-wallet
    metadata: model.json().nullable(),
})
// Entity l-khassa b l-wallet dial l-client
