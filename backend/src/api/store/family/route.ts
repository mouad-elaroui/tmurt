import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/family - Jbed l-groups dial l-customer
export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach tchouf l-family groups"
            })
        }

        const familyService = req.scope.resolve("familySync") as any
        const groups = await familyService.getCustomerGroups(customerId)

        return res.json({ groups })
    } catch (error: any) {
        console.error("[Family] GET Error:", error)
        return res.status(500).json({ error: error.message })
    }
}

// POST /store/family - Create new family group
export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        const customerId = (req as { auth_context?: { actor_id?: string } }).auth_context?.actor_id
        if (!customerId) {
            return res.status(401).json({
                error: "Authentication required",
                message: "Khassek t-connecta bach t-creyi group"
            })
        }

        const { name } = req.body as { name: string }

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                error: "Group name required",
                message: "Khass smiya dial l-group (2+ characters)"
            })
        }

        const familyService = req.scope.resolve("familySync") as any
        const result = await familyService.createGroup(customerId, name.trim())

        return res.status(201).json(result)
    } catch (error: any) {
        console.error("[Family] POST Error:", error)
        return res.status(400).json({ error: error.message })
    }
}
