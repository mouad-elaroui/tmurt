
import { Container, Heading, Table } from "@medusajs/ui"
import { RouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

const WalletPage = () => {
    // Hna kan-affichiw la liste dial l-wallets
    const [wallets, setWallets] = useState([])

    useEffect(() => {
        // Fetch wallets from our new API
        fetch("/admin/wallets")
            .then(res => res.json())
            .then(data => setWallets(data.wallets))
            .catch(err => console.error(err))
    }, [])

    return (
        <Container>
            <Heading level="h1" className="mb-6">Wallets</Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Customer ID</Table.HeaderCell>
                        <Table.HeaderCell>Balance</Table.HeaderCell>
                        <Table.HeaderCell>Currency</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {wallets.length > 0 ? (
                        wallets.map((w: any) => (
                            <Table.Row key={w.id}>
                                <Table.Cell>{w.id}</Table.Cell>
                                <Table.Cell>{w.customer_id}</Table.Cell>
                                <Table.Cell>{w.balance}</Table.Cell>
                                <Table.Cell>{w.currency_code}</Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={4} className="text-center">No wallets found</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config: RouteConfig = {
    link: {
        label: "Wallets",
        icon: "CurrencyDollar",
    },
}

export default WalletPage
