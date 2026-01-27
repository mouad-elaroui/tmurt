import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DIGITAL_PASSPORT_MODULE } from "../../../modules/digital-passport"
import { DigitalPassportService } from "../../../modules/digital-passport/service"

// POST /demo/generate-passport - Demo endpoint to generate passport for an order
// This endpoint is for demo purposes only
export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { order_id } = req.body as { order_id: string }

    if (!order_id) {
        return res.status(400).json({ message: "order_id is required" })
    }

    const digitalPassportService: DigitalPassportService = req.scope.resolve(
        DIGITAL_PASSPORT_MODULE
    )

    try {
        const passport = await digitalPassportService.createPassport(order_id, {
            source: "demo_endpoint",
            created_at: new Date().toISOString()
        })

        res.json({
            success: true,
            message: "Passport created successfully",
            passport: {
                id: passport.id,
                order_id: passport.order_id,
                token_id: passport.token_id,
                verify_url: `http://localhost:8000/passport/verify/${passport.token_id}`
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json({ message: "Error creating passport", error: message })
    }
}

// GET /demo/generate-passport - List passports or check status
export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { order_id } = req.query

    const digitalPassportService: DigitalPassportService = req.scope.resolve(
        DIGITAL_PASSPORT_MODULE
    )

    try {
        if (order_id) {
            const passport = await digitalPassportService.getPassportByOrder(order_id as string)
            if (!passport) {
                return res.status(404).json({ message: "Passport not found for this order" })
            }
            return res.json({ passport })
        }

        // List all passports
        const [passports, count] = await digitalPassportService.listAndCountDigitalPassports({})
        res.json({ passports, count })
    } catch (error) {
        res.status(500).json({ message: "Error fetching passports" })
    }
}
