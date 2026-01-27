import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /store/product-passport/:id - Public verification endpoint
// Hna fin l-nas iqedrou y-verifiyiw l-authenticity dial l-produit
export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    try {
        const { id: tokenId } = req.params

        if (!tokenId) {
            return res.status(400).json({
                valid: false,
                error: "Token ID required",
                message: "Khass token ID bach t-verifyi l-passport",
            })
        }

        const passportService = req.scope.resolve("digitalPassportService") as any

        // Jbed l-passport details l-kamlin
        const passportDetails = await passportService.getFullPassportDetails(tokenId)

        if (!passportDetails) {
            return res.status(404).json({
                valid: false,
                error: "PASSPORT_NOT_FOUND",
                message: "This passport does not exist or has been revoked",
            })
        }

        return res.json({
            valid: true,
            passport: {
                id: passportDetails.passport_id,
                token: passportDetails.token_id,
                created_at: passportDetails.created_at,
                // Origin info - mn ayn ja l-produit
                origin: passportDetails.origin,
                // Fabric certification
                fabric: passportDetails.fabric,
                // Ownership history - blockchain style
                ownership_log: passportDetails.ownership_log,
                // Product info
                product: passportDetails.product_info,
                // QR code data l-share
                qr: passportDetails.qr_data,
            },
            message: passportDetails.message,
        })
    } catch (error) {
        console.error("[Product Passport] Verification error:", error)
        return res.status(500).json({
            valid: false,
            error: "VERIFICATION_FAILED",
            message: "Unable to verify passport at this time",
        })
    }
}
