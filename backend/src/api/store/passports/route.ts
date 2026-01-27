import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DIGITAL_PASSPORT_MODULE } from "../../../modules/digital-passport"
import { DigitalPassportService } from "../../../modules/digital-passport/service"

// POST /store/passports - Create passport for order (demo endpoint)
// Note: This should be protected in production
export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { order_id, metadata } = req.body as {
        order_id: string
        metadata?: Record<string, unknown>
    }

    if (!order_id) {
        return res.status(400).json({ message: "order_id is required" })
    }

    const digitalPassportService: DigitalPassportService = req.scope.resolve(
        DIGITAL_PASSPORT_MODULE
    )

    try {
        const passport = await digitalPassportService.createPassport(order_id, metadata)

        // Generate verify URL
        const verifyUrl = `${req.headers.origin || "http://localhost:8000"}/passport/verify/${passport.token_id}`

        res.json({
            success: true,
            passport: {
                id: passport.id,
                order_id: passport.order_id,
                token_id: passport.token_id,
                verify_url: verifyUrl,
                created_at: (passport.metadata as { created_at?: string })?.created_at,
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json({ message: "Error creating passport", error: message })
    }
}


export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { order_id } = req.query

    if (!order_id) {
        return res.status(400).json({ message: "order_id is required" })
    }

    const digitalPassportService: DigitalPassportService = req.scope.resolve(
        DIGITAL_PASSPORT_MODULE
    )

    try {
        const passport = await digitalPassportService.getPassportByOrder(order_id as string)

        if (!passport) {
            return res.status(404).json({ message: "Passport not found for this order" })
        }

        // Generate verify URL
        // In production, this should point to the storefront URL
        const verifyUrl = `${req.headers.origin || "http://localhost:8000"}/passport/verify/${passport.token_id}`

        res.json({
            passport: {
                ...passport,
                token: passport.token_id, // Map token_id to token for frontend convenience if needed
                verify_url: verifyUrl
            }
        })
    } catch (error) {
        res.status(404).json({ message: "Passport not found for this order" })
    }
}
