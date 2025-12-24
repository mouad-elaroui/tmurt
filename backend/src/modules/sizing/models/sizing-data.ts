import { model } from "@medusajs/framework/utils"

export const SizingData = model.define("sizing_data", {
    id: model.id().primaryKey(),
    customer_id: model.text().searchable(),
    measurements: model.json(), // L-data dial l-3barat (measurements)
    recommended_size: model.text(),
})
// Entity bach n-stockiw data dial sizing l-khas b l-client
