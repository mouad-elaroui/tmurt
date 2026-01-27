import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DIGITAL_PASSPORT_MODULE } from "../../../../modules/digital-passport"
import { DigitalPassportService } from "../../../../modules/digital-passport/service"

// GET /store/passport/verify?token=XXX - Verify passport authenticity
// Hna fin l-customer kat-verifier l-authenticity dial l-produit
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const passportService: DigitalPassportService = req.scope.resolve(DIGITAL_PASSPORT_MODULE)

        const token = req.query.token as string

        if (!token) {
            res.status(400).json({
                valid: false,
                message: "Token parameter is required"
            })
            return
        }

        const result = await passportService.verifyPassport(token)
        res.json(result)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error"
        res.status(500).json({
            valid: false,
            message: "Error verifying passport",
            error: message
        })
    }
}
