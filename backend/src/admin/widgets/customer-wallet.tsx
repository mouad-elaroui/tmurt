
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

const CustomerWalletWidget = () => {
    // Widget l-khas b l-affichage dial l-solde l-wallet
    // Normally we would fetch the wallet here using useQuery or similar, 
    // but for now we'll show a placeholder as the API client integration requires more setup.
    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Tmurt Wallet</Heading>
            </div>
            <div className="px-6 py-4">
                <Text>Balance: 0.00 MAD</Text>
                <Text className="text-ui-fg-subtle text-small-regular">
            // Blassa fin kan-baynou l-solde
                </Text>
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "customer.details.after",
})

export default CustomerWalletWidget
