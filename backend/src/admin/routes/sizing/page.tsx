
import { Container, Heading, Table } from "@medusajs/ui"
import { RouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

const SizingPage = () => {
    // Hna kan-jeriw l-donnees dial sizing
    const [sizingData, setSizingData] = useState([])

    useEffect(() => {
        fetch("/admin/sizing")
            .then(res => res.json())
            .then(data => setSizingData(data.sizing_data))
            .catch(err => console.error(err))
    }, [])

    return (
        <Container>
            <Heading level="h1" className="mb-6">Sizing Data</Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Customer ID</Table.HeaderCell>
                        <Table.HeaderCell>Recommended Size</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sizingData.length > 0 ? (
                        sizingData.map((d: any) => (
                            <Table.Row key={d.id}>
                                <Table.Cell>{d.id}</Table.Cell>
                                <Table.Cell>{d.customer_id}</Table.Cell>
                                <Table.Cell>{d.recommended_size}</Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={3} className="text-center">No sizing data found</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config: RouteConfig = {
    link: {
        label: "Sizing Data",
        icon: "Ruler",
    },
}

export default SizingPage
