import { model } from "@medusajs/framework/utils"

// SharedWishlistItem - L-produit li sharewa l-3a2ila
// Kol member yqder y-add products l-wishlist l-mochterka
export const SharedWishlistItem = model.define("shared_wishlist_item", {
    id: model.id().primaryKey(),
    group_id: model.text().searchable(), // FamilyGroup ID
    product_id: model.text().searchable(), // Product ID
    added_by: model.text(), // Customer ID dial li zad l-produit
    note: model.text().nullable(), // Message wla note
    priority: model.text().nullable(), // "high" | "medium" | "low"
    metadata: model.json().nullable(),
})
// Hna kan-storiw l-wishlist l-mochterka dial l-3a2ila
