import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/family/:groupId/wishlist - Get shared wishlist
export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach tchouf l-wishlist"
            })
        }

        const { groupId } = req.params

        const familyService = req.scope.resolve("familySync") as any
        const items = await familyService.getSharedWishlist(groupId, customerId)

        return res.json({ items })
    } catch (error: any) {
        console.error("[Family Wishlist] GET Error:", error)
        return res.status(400).json({ error: error.message })
    }
}

// POST /store/family/:groupId/wishlist - Add to shared wishlist
export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach tzid l-wishlist"
            })
        }

        const { groupId } = req.params
        const { product_id, note, priority } = req.body as {
            product_id: string
            note?: string
            priority?: string
        }

        if (!product_id) {
            return res.status(400).json({
                error: "product_id required",
                message: "Khass product_id"
            })
        }

        const familyService = req.scope.resolve("familySync") as any
        const result = await familyService.addToSharedWishlist(
            groupId,
            customerId,
            product_id,
            note,
            priority
        )

        return res.status(201).json(result)
    } catch (error: any) {
        console.error("[Family Wishlist] POST Error:", error)
        return res.status(400).json({ error: error.message })
    }
}

// DELETE /store/family/:groupId/wishlist - Remove from wishlist
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    try {
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach t-supprimi mn l-wishlist"
            })
        }

        const { item_id } = req.body as { item_id: string }

        if (!item_id) {
            return res.status(400).json({ error: "item_id required" })
        }

        const familyService = req.scope.resolve("familySync") as any
        const result = await familyService.removeFromWishlist(item_id, customerId)

        return res.json(result)
    } catch (error: any) {
        console.error("[Family Wishlist] DELETE Error:", error)
        return res.status(400).json({ error: error.message })
    }
}
