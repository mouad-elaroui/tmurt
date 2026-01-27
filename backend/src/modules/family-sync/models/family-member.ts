import { model } from "@medusajs/framework/utils"

// FamilyMember - L-member dial l-group
// Role: "owner" | "admin" | "member"
// Status: "pending" | "active" | "declined"
export const FamilyMember = model.define("family_member", {
    id: model.id().primaryKey(),
    group_id: model.text().searchable(), // FamilyGroup ID
    customer_id: model.text().searchable(), // Customer ID
    role: model.text().default("member"), // owner, admin, member
    status: model.text().default("pending"), // pending, active, declined
    invited_email: model.text().nullable(), // Email dial l-invitation
    metadata: model.json().nullable(),
})
// Hna kan-storiw l-members dial kol group
