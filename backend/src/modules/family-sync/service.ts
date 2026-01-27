import { MedusaService } from "@medusajs/framework/utils"
import { FamilyGroup } from "./models/family-group"
import { FamilyMember } from "./models/family-member"
import { SharedWishlistItem } from "./models/shared-wishlist-item"

// Service l-khas b l-family sync - l-shopping dial l-3a2ila
export class FamilySyncService extends MedusaService({
    FamilyGroup,
    FamilyMember,
    SharedWishlistItem,
}) {
    // Generate invite code - unique code l-invitation
    private generateInviteCode(): string {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        let code = "FAM-"
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    // Create family group - kra group jdid
    async createGroup(ownerId: string, name: string) {
        // Check wach l-owner 3ndou group deja
        const [existingOwned] = await this.listAndCountFamilyMembers({
            customer_id: ownerId,
            role: "owner",
        })

        if (existingOwned.length > 0) {
            throw new Error("You already own a family group")
        }

        const inviteCode = this.generateInviteCode()

        // Create l-group
        const group = await this.createFamilyGroups({
            owner_id: ownerId,
            name: name,
            invite_code: inviteCode,
            metadata: {
                created_at: new Date().toISOString(),
            },
        })

        // Add l-owner ka member
        await this.createFamilyMembers({
            group_id: group.id,
            customer_id: ownerId,
            role: "owner",
            status: "active",
        })

        return {
            group_id: group.id,
            name: group.name,
            invite_code: inviteCode,
        }
    }

    // Get groups dial customer - l-groups li houwa fihom
    async getCustomerGroups(customerId: string) {
        // Jbed l-memberships dial had l-customer
        const [memberships] = await this.listAndCountFamilyMembers({
            customer_id: customerId,
            status: "active",
        })

        const groups = []
        for (const membership of memberships) {
            const [groupData] = await this.listAndCountFamilyGroups({
                id: membership.group_id,
            })

            if (groupData.length > 0) {
                const group = groupData[0]

                // Jbed l-members dial had l-group
                const [members] = await this.listAndCountFamilyMembers({
                    group_id: group.id,
                    status: "active",
                })

                groups.push({
                    id: group.id,
                    name: group.name,
                    invite_code: membership.role === "owner" ? group.invite_code : null,
                    role: membership.role,
                    member_count: members.length,
                    members: members.map(m => ({
                        id: m.id,
                        customer_id: m.customer_id,
                        role: m.role,
                    })),
                })
            }
        }

        return groups
    }

    // Invite member - send invitation
    async inviteMember(groupId: string, inviterId: string, email: string) {
        // Check wach l-inviter 3ndou permission
        const [inviterMembership] = await this.listAndCountFamilyMembers({
            group_id: groupId,
            customer_id: inviterId,
            status: "active",
        })

        if (inviterMembership.length === 0) {
            throw new Error("You are not a member of this group")
        }

        const inviter = inviterMembership[0]
        if (inviter.role !== "owner" && inviter.role !== "admin") {
            throw new Error("You don't have permission to invite members")
        }

        // Check wach deja invited
        const [existing] = await this.listAndCountFamilyMembers({
            group_id: groupId,
            invited_email: email,
        })

        if (existing.length > 0) {
            throw new Error("This email has already been invited")
        }

        // Create pending membership
        const member = await this.createFamilyMembers({
            group_id: groupId,
            customer_id: "", // Will be filled when they accept
            role: "member",
            status: "pending",
            invited_email: email,
            metadata: {
                invited_at: new Date().toISOString(),
                invited_by: inviterId,
            },
        })

        return {
            invitation_id: member.id,
            email: email,
            status: "pending",
            message: "Invitation sent successfully",
        }
    }

    // Accept invitation - by invite code
    async acceptInvitation(customerId: string, inviteCode: string) {
        // Find l-group b l-invite code
        const [groups] = await this.listAndCountFamilyGroups({
            invite_code: inviteCode,
        })

        if (groups.length === 0) {
            throw new Error("Invalid invite code")
        }

        const group = groups[0]

        // Check wach deja member
        const [existingMembership] = await this.listAndCountFamilyMembers({
            group_id: group.id,
            customer_id: customerId,
        })

        if (existingMembership.length > 0) {
            throw new Error("You are already a member of this group")
        }

        // Create active membership
        const member = await this.createFamilyMembers({
            group_id: group.id,
            customer_id: customerId,
            role: "member",
            status: "active",
            metadata: {
                joined_at: new Date().toISOString(),
            },
        })

        return {
            success: true,
            group_id: group.id,
            group_name: group.name,
            message: `You have joined ${group.name}`,
        }
    }

    // Add to shared wishlist - zid produit l-wishlist l-mochterka
    async addToSharedWishlist(
        groupId: string,
        customerId: string,
        productId: string,
        note?: string,
        priority?: string
    ) {
        // Check wach l-customer member f had l-group
        const [membership] = await this.listAndCountFamilyMembers({
            group_id: groupId,
            customer_id: customerId,
            status: "active",
        })

        if (membership.length === 0) {
            throw new Error("You are not a member of this group")
        }

        // Check wach l-product deja f l-wishlist
        const [existing] = await this.listAndCountSharedWishlistItems({
            group_id: groupId,
            product_id: productId,
        })

        if (existing.length > 0) {
            throw new Error("This product is already in the wishlist")
        }

        const item = await this.createSharedWishlistItems({
            group_id: groupId,
            product_id: productId,
            added_by: customerId,
            note: note ?? null,
            priority: priority ?? "medium",
            metadata: {
                added_at: new Date().toISOString(),
            },
        })

        return {
            item_id: item.id,
            product_id: productId,
            message: "Added to shared wishlist",
        }
    }

    // Get shared wishlist - jbed l-wishlist dial l-group
    async getSharedWishlist(groupId: string, customerId: string) {
        // Check wach l-customer member
        const [membership] = await this.listAndCountFamilyMembers({
            group_id: groupId,
            customer_id: customerId,
            status: "active",
        })

        if (membership.length === 0) {
            throw new Error("You are not a member of this group")
        }

        const [items] = await this.listAndCountSharedWishlistItems({
            group_id: groupId,
        })

        return items.map(item => ({
            id: item.id,
            product_id: item.product_id,
            added_by: item.added_by,
            note: item.note,
            priority: item.priority,
            added_at: (item.metadata as { added_at?: string })?.added_at,
        }))
    }

    // Remove from wishlist
    async removeFromWishlist(itemId: string, customerId: string) {
        const [items] = await this.listAndCountSharedWishlistItems({
            id: itemId,
        })

        if (items.length === 0) {
            throw new Error("Item not found")
        }

        const item = items[0]

        // Check wach l-customer yqder y-suprimi (added_by wla admin)
        const [membership] = await this.listAndCountFamilyMembers({
            group_id: item.group_id,
            customer_id: customerId,
            status: "active",
        })

        if (membership.length === 0) {
            throw new Error("You are not a member of this group")
        }

        const member = membership[0]
        if (item.added_by !== customerId && member.role !== "owner" && member.role !== "admin") {
            throw new Error("You can only remove items you added")
        }

        await this.deleteSharedWishlistItems(itemId)

        return { success: true, message: "Item removed from wishlist" }
    }
}
