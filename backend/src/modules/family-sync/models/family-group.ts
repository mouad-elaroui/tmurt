import { model } from "@medusajs/framework/utils"

// FamilyGroup - L-groupe dial l-3a2ila
// Owner houwa li kra l-group w yqder y-inviti l-3a2ila
export const FamilyGroup = model.define("family_group", {
    id: model.id().primaryKey(),
    owner_id: model.text().searchable(), // Customer ID dial l-owner
    name: model.text(), // Smiya dial l-group (e.g., "Al-Fassi Family")
    invite_code: model.text().nullable(), // Code l-invitation
    metadata: model.json().nullable(),
})
// Hna kan-storiw l-groups dyal l-3a2ilat
