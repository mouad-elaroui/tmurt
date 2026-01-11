// wallet widget l customer details

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

const CustomerWalletWidget = () => (
    <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h2">Tmurt Wallet</Heading>
        </div>
        <div className="px-6 py-4">
            <Text>Balance: 0.00 MAD</Text>
            <Text className="text-ui-fg-subtle text-small-regular">
                Wallet balance dyal customer
            </Text>
        </div>
    </Container>
)

export const config = defineWidgetConfig({
    zone: "customer.details.after",
})

export default CustomerWalletWidget
