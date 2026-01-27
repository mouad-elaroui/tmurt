import { MedusaService } from "@medusajs/framework/utils"
import { DigitalPassport } from "./models/digital-passport"

// Service l-khas b l-gestion dial l-digital passports
// Kat-mettel l-hawiya raqmiya dial l-produit
export class DigitalPassportService extends MedusaService({
    DigitalPassport,
}) {
    // Generer unique token l-passport
    private generateToken(): string {
        const timestamp = Date.now().toString(36)
        const random = Math.random().toString(36).substring(2, 10)
        return `TM-${timestamp}-${random}`.toUpperCase()
    }

    // Create passport jdid l-order
    async createPassport(orderId: string, metadata?: Record<string, unknown>) {
        // Check wach kayn passport deja
        const [existing] = await this.listAndCountDigitalPassports({
            order_id: orderId
        })

        if (existing.length > 0) {
            return existing[0]
        }

        const tokenId = this.generateToken()

        const passport = await this.createDigitalPassports({
            order_id: orderId,
            token_id: tokenId,
            metadata: {
                created_at: new Date().toISOString(),
                ...metadata,
            },
        })

        return passport
    }

    // Verify passport authenticity b token
    async verifyPassport(tokenId: string) {
        const [passports] = await this.listAndCountDigitalPassports({
            token_id: tokenId
        })

        if (passports.length === 0) {
            return {
                valid: false,
                message: "Passport not found",
            }
        }

        const passport = passports[0]
        return {
            valid: true,
            passport_id: passport.id,
            order_id: passport.order_id,
            token_id: passport.token_id,
            created_at: (passport.metadata as { created_at?: string })?.created_at,
            message: "Authentic Tmurt product",
        }
    }

    // Get passport by order ID
    async getPassportByOrder(orderId: string) {
        const [passports] = await this.listAndCountDigitalPassports({
            order_id: orderId
        })

        return passports.length > 0 ? passports[0] : null
    }

    // Generate QR code data for passport
    getQRCodeData(tokenId: string, baseUrl: string = "https://tmurt.ma") {
        return {
            url: `${baseUrl}/verify/${tokenId}`,
            token: tokenId,
        }
    }
}
