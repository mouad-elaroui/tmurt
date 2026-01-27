import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /store/family/join - Accept invitation by code
export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach t-joini group"
            })
        }

        const { invite_code } = req.body as { invite_code: string }

        if (!invite_code) {
            return res.status(400).json({
                error: "Invite code required",
                message: "Khass invite code"
            })
        }

        const familyService = req.scope.resolve("familySync") as any
        const result = await familyService.acceptInvitation(customerId, invite_code.toUpperCase())

        return res.json(result)
    } catch (error: any) {
        console.error("[Family Join] Error:", error)
        return res.status(400).json({ error: error.message })
    }
}
