
import { Container, Heading, Table } from "@medusajs/ui"
import { RouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

const PassportPage = () => {
    // Hna kan-affichiw les passeports digitaux
    const [passports, setPassports] = useState([])

    useEffect(() => {
        fetch("/admin/digital-passports")
            .then(res => res.json())
            .then(data => setPassports(data.digital_passports))
            .catch(err => console.error(err))
    }, [])

    return (
        <Container>
            <Heading level="h1" className="mb-6">Digital Passports</Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Token ID</Table.HeaderCell>
                        <Table.HeaderCell>Order ID</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {passports.length > 0 ? (
                        passports.map((p: any) => (
                            <Table.Row key={p.id}>
                                <Table.Cell>{p.id}</Table.Cell>
                                <Table.Cell>{p.token_id}</Table.Cell>
                                <Table.Cell>{p.order_id}</Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={3} className="text-center">No passports found</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config: RouteConfig = {
    link: {
        label: "Digital Passports",
        icon: "DocumentText",
    },
}

export default PassportPage
