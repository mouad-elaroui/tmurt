import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST /store/family/invite - Send invitation
export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach t-inviti"
            })
        }

        const { group_id, email } = req.body as { group_id: string; email: string }

        if (!group_id || !email) {
            return res.status(400).json({
                error: "group_id and email required",
                message: "Khass group_id w email"
            })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Invalid email format",
                message: "Email machi sahi"
            })
        }

        const familyService = req.scope.resolve("familySync") as any
        const result = await familyService.inviteMember(group_id, customerId, email)

        return res.json(result)
    } catch (error: any) {
        console.error("[Family Invite] Error:", error)
        return res.status(400).json({ error: error.message })
    }
}
