import { model } from "@medusajs/framework/utils"

export const DigitalPassport = model.define("digital_passport", {
    id: model.id().primaryKey(),
    order_id: model.text(),
    token_id: model.text().unique(), // L-identifiant unique dial l-passport
    metadata: model.json().nullable(), // Ma3lumat idafiya bhal date creation
})
// Entity li kat-mettel l-hawiya raqmiya dial l-produit
