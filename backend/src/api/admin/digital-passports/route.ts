
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DIGITAL_PASSPORT_MODULE } from "../../../modules/digital-passport"
import { DigitalPassportService } from "../../../modules/digital-passport/service"

// GET /admin/digital-passports - List all passports
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const passportService: DigitalPassportService = req.scope.resolve(DIGITAL_PASSPORT_MODULE)
    // Hna kan-jebdo la liste dial passports
    const [passports, count] = await passportService.listAndCountDigitalPassports(req.query)

    res.json({
        digital_passports: passports,
        count,
    })
}

// POST /admin/digital-passports - Create passport for order
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const passportService: DigitalPassportService = req.scope.resolve(DIGITAL_PASSPORT_MODULE)

        const { order_id, metadata } = req.body as {
            order_id: string
            metadata?: Record<string, unknown>
        }

        if (!order_id) {
            res.status(400).json({
                message: "order_id is required"
            })
            return
        }

        // Create passport l-order
        const passport = await passportService.createPassport(order_id, metadata)
        const qrData = passportService.getQRCodeData(passport.token_id)

        res.json({
            success: true,
            passport: {
                id: passport.id,
                order_id: passport.order_id,
                token_id: passport.token_id,
                created_at: (passport.metadata as { created_at?: string })?.created_at,
            },
            qr_code: qrData,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json({
            message: "Error creating passport",
            error: message
        })
    }
}
