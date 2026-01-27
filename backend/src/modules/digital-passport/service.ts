import { MedusaService } from "@medusajs/framework/utils"
import { DigitalPassport } from "./models/digital-passport"

// Types dial l-passport data
interface OwnershipLog {
    owner_id: string
    owner_name?: string
    date: string
    action: "CREATED" | "TRANSFERRED" | "VERIFIED"
}

interface PassportMetadata {
    created_at: string
    origin: {
        city: string
        region: string
        country: string
        artisan?: string
    }
    fabric: {
        type: string
        quality: string
        certified: boolean
        certificate_id?: string
    }
    ownership_log: OwnershipLog[]
    product_info?: {
        name: string
        sku?: string
        category?: string
    }
}

// Service l-khas b l-gestion dial l-digital passports
// Kat-mettel l-hawiya raqmiya dial l-produit
export class DigitalPassportService extends MedusaService({
    DigitalPassport,
}) {
    // Generer unique token l-passport - Blockchain-style format
    private generateToken(): string {
        const timestamp = Date.now().toString(36)
        const random = Math.random().toString(36).substring(2, 10)
        const checksum = Math.random().toString(36).substring(2, 6)
        return `TM-${timestamp}-${random}-${checksum}`.toUpperCase()
    }

    // Create passport jdid l-order b data kamla
    async createPassport(
        orderId: string,
        productInfo?: { name: string; sku?: string; category?: string },
        customMetadata?: Record<string, unknown>
    ) {
        // Check wach kayn passport deja
        const [existing] = await this.listAndCountDigitalPassports({
            order_id: orderId
        })

        if (existing.length > 0) {
            return existing[0]
        }

        const tokenId = this.generateToken()
        const now = new Date().toISOString()

        // Metadata l-kamla dial l-passport
        const metadata: PassportMetadata = {
            created_at: now,
            // Origin - mn ayn ja l-produit
            origin: {
                city: "Fès",
                region: "Fès-Meknès",
                country: "Morocco",
                artisan: "Tmurt Atelier",
            },
            // Fabric info - naw3 l-qmach
            fabric: {
                type: "Silk & Cotton Blend",
                quality: "Premium",
                certified: true,
                certificate_id: `CERT-${Date.now().toString(36).toUpperCase()}`,
            },
            // Ownership log - blockchain-style
            ownership_log: [{
                owner_id: "tmurt-store",
                owner_name: "Tmurt Official Store",
                date: now,
                action: "CREATED",
            }],
            product_info: productInfo,
            ...customMetadata,
        }

        const passport = await this.createDigitalPassports({
            order_id: orderId,
            token_id: tokenId,
            metadata: metadata as Record<string, unknown>,
        })

        return passport
    }

    // Verify passport authenticity b token - l-public endpoint
    async verifyPassport(tokenId: string) {
        const [passports] = await this.listAndCountDigitalPassports({
            token_id: tokenId
        })

        if (passports.length === 0) {
            return {
                valid: false,
                message: "Passport not found",
                error: "PASSPORT_NOT_FOUND",
            }
        }

        const passport = passports[0]
        const meta = passport.metadata as PassportMetadata

        // Log l-verification f l-ownership log (ma kan-saviwch, ghir kan-returniw)
        const verificationLog: OwnershipLog = {
            owner_id: "anonymous",
            date: new Date().toISOString(),
            action: "VERIFIED",
        }

        return {
            valid: true,
            passport_id: passport.id,
            order_id: passport.order_id,
            token_id: passport.token_id,
            // L-data l-kamla l-verification page
            created_at: meta?.created_at,
            origin: meta?.origin || {
                city: "Fès",
                region: "Fès-Meknès",
                country: "Morocco",
            },
            fabric: meta?.fabric || {
                type: "Traditional Moroccan Fabric",
                quality: "Premium",
                certified: true,
            },
            ownership_log: [...(meta?.ownership_log || []), verificationLog],
            product_info: meta?.product_info,
            message: "Authentic Tmurt product - Certified genuine",
        }
    }

    // Get passport details l-public page - full data
    async getFullPassportDetails(tokenId: string) {
        const verification = await this.verifyPassport(tokenId)

        if (!verification.valid) {
            return null
        }

        return {
            ...verification,
            qr_data: this.getQRCodeData(tokenId),
        }
    }

    // Get passport by order ID
    async getPassportByOrder(orderId: string) {
        const [passports] = await this.listAndCountDigitalPassports({
            order_id: orderId
        })

        return passports.length > 0 ? passports[0] : null
    }

    // Transfer ownership - kan-bdlou l-owner f l-log
    async transferOwnership(tokenId: string, newOwnerId: string, newOwnerName?: string) {
        const [passports] = await this.listAndCountDigitalPassports({
            token_id: tokenId
        })

        if (passports.length === 0) {
            throw new Error("Passport not found")
        }

        const passport = passports[0]
        const meta = passport.metadata as PassportMetadata

        // Zid f l-ownership log
        const transferLog: OwnershipLog = {
            owner_id: newOwnerId,
            owner_name: newOwnerName,
            date: new Date().toISOString(),
            action: "TRANSFERRED",
        }

        const updatedMeta: PassportMetadata = {
            ...meta,
            ownership_log: [...(meta.ownership_log || []), transferLog],
        }

        await this.updateDigitalPassports({
            id: passport.id,
            metadata: updatedMeta as Record<string, unknown>,
        })

        return {
            success: true,
            passport_id: passport.id,
            new_owner: newOwnerId,
            message: "Ownership transferred successfully",
        }
    }

    // Generate QR code data for passport
    getQRCodeData(tokenId: string, baseUrl: string = "https://tmurt.ma") {
        return {
            url: `${baseUrl}/verify/${tokenId}`,
            token: tokenId,
            verification_link: `${baseUrl}/verify/${tokenId}`,
        }
    }
}
