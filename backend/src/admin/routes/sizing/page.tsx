"use client"

import { Container, Heading, Table, Text, Badge, Button, Input } from "@medusajs/ui"
import { RouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState, useMemo, Fragment, type ReactNode, type ChangeEvent } from "react"

// Typo dyal sizing data - strict TypeScript
interface SizingData {
    id: string
    customer_id: string
    recommended_size: string
    chest?: number
    waist?: number
    hips?: number
    height?: number
    created_at?: string
}

interface StatCardProps {
    title: string
    value: string | number
}

// Stat Card - component dyalna l-statistiques
const StatCard = ({ title, value }: StatCardProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <Text className="text-sm text-gray-500">{title}</Text>
        <Heading level="h3" className="text-xl font-bold mt-1">
            {value}
        </Heading>
    </div>
)

interface SizeDistributionChartProps {
    data: Record<string, number>
}

// Chart dyal distribution dyal sizes
const SizeDistributionChart = ({ data }: SizeDistributionChartProps) => {
    const maxCount = Math.max(...Object.values(data), 1)
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <Heading level="h3" className="text-sm font-medium text-gray-700 mb-4">
                Size Distribution
            </Heading>
            <div className="flex items-end justify-between gap-2 h-40">
                {sizes.map((size) => {
                    const count = data[size] ?? 0
                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0

                    return (
                        <div key={size} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-t transition-all duration-500"
                                style={{ height: `${height}%`, minHeight: count > 0 ? "8px" : "0" }}
                            />
                            <Text className="text-xs font-medium mt-2">{size}</Text>
                            <Text className="text-xs text-gray-400">{count}</Text>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

interface SizingDetailRowProps {
    data: SizingData
    isExpanded: boolean
    onToggle: () => void
}

// Helper bash n-jobo color dyal badge
const getSizeBadgeColor = (size: string): "green" | "blue" | "grey" => {
    if (size === "M") return "green"
    if (size === "L" || size === "XL") return "blue"
    return "grey"
}

// Row dyal table m3a details
const SizingDetailRow = ({ data, isExpanded, onToggle }: SizingDetailRowProps) => (
    <Fragment>
        <Table.Row
            className="hover:bg-gray-50 cursor-pointer"
            onClick={onToggle}
        >
            <Table.Cell className="font-mono text-sm">
                {data.id.slice(0, 12)}...
            </Table.Cell>
            <Table.Cell className="font-mono text-sm">
                {data.customer_id.slice(0, 12)}...
            </Table.Cell>
            <Table.Cell>
                <Badge color={getSizeBadgeColor(data.recommended_size)}>
                    {data.recommended_size}
                </Badge>
            </Table.Cell>
            <Table.Cell>
                {data.created_at
                    ? new Date(data.created_at).toLocaleDateString()
                    : "N/A"
                }
            </Table.Cell>
            <Table.Cell>
                <Button variant="secondary" size="small">
                    {isExpanded ? "Hide" : "Details"}
                </Button>
            </Table.Cell>
        </Table.Row>
        {isExpanded && (
            <Table.Row className="bg-amber-50">
                <Table.Cell {...{ colSpan: 5 } as React.TdHTMLAttributes<HTMLTableCellElement>} className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                            <Text className="text-xs text-gray-500">Chest</Text>
                            <Text className="font-bold">{data.chest ?? "N/A"} cm</Text>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                            <Text className="text-xs text-gray-500">Waist</Text>
                            <Text className="font-bold">{data.waist ?? "N/A"} cm</Text>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                            <Text className="text-xs text-gray-500">Hips</Text>
                            <Text className="font-bold">{data.hips ?? "N/A"} cm</Text>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                            <Text className="text-xs text-gray-500">Height</Text>
                            <Text className="font-bold">{data.height ?? "N/A"} cm</Text>
                        </div>
                    </div>
                </Table.Cell>
            </Table.Row>
        )}
    </Fragment>
)

const SizingPage = () => {
    const [sizingData, setSizingData] = useState<SizingData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [sizeFilter, setSizeFilter] = useState("")

    // Fetch data - async function
    const fetchSizingData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/admin/sizing")
            const data = await res.json()
            setSizingData(data.sizing_data ?? [])
        } catch (err) {
            console.error("Khata f fetch sizing data:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSizingData()
    }, [])

    // Calculate size distribution b reduce
    const sizeDistribution = useMemo(() =>
        sizingData.reduce<Record<string, number>>((dist, d) => {
            const size = d.recommended_size || "Unknown"
            dist[size] = (dist[size] ?? 0) + 1
            return dist
        }, {}),
        [sizingData]
    )

    // Filter data - modern chained methods
    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase()

        return sizingData
            .filter(d =>
                !searchTerm ||
                d.id.toLowerCase().includes(term) ||
                d.customer_id.toLowerCase().includes(term)
            )
            .filter(d => !sizeFilter || d.recommended_size === sizeFilter)
    }, [sizingData, searchTerm, sizeFilter])

    // Most common size
    const mostCommonSize = useMemo(() => {
        const entries = Object.entries(sizeDistribution)
        return entries.length > 0
            ? entries.sort((a, b) => b[1] - a[1])[0][0]
            : "N/A"
    }, [sizeDistribution])

    // Export to CSV
    const exportToCSV = () => {
        const headers = ["ID", "Customer ID", "Recommended Size", "Chest", "Waist", "Hips", "Height"]
        const rows = filteredData.map(d => [
            d.id,
            d.customer_id,
            d.recommended_size,
            d.chest ?? "",
            d.waist ?? "",
            d.hips ?? "",
            d.height ?? ""
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.join(","))
            .join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `sizing-data-${new Date().toISOString().split("T")[0]}.csv`
        link.click()
    }

    // Toggle expanded row
    const handleToggle = (id: string) => {
        setExpandedId(prev => prev === id ? null : id)
    }

    return (
        <Container className="p-8">
            {/* Page Header */}
            <div className="mb-8">
                <Heading level="h1" className="text-3xl font-bold mb-2">
                    Sizing Data
                </Heading>
                <Text className="text-gray-500">
                    Customer measurements and size recommendations
                </Text>
            </div>

            {/* Statistics and Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard title="Total Records" value={sizingData.length} />
                <StatCard title="Most Common Size" value={mostCommonSize} />
                <StatCard
                    title="Unique Customers"
                    value={new Set(sizingData.map(d => d.customer_id)).size}
                />
            </div>

            <div className="mb-8">
                <SizeDistributionChart data={sizeDistribution} />
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by ID or Customer ID..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                >
                    <option value="">All Sizes</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>
                <Button variant="secondary" onClick={fetchSizingData}>
                    Refresh
                </Button>
                <Button variant="primary" onClick={exportToCSV}>
                    Export CSV
                </Button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Customer ID</Table.HeaderCell>
                            <Table.HeaderCell>Recommended Size</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            <Table.Row>
                                <Table.Cell {...{ colSpan: 5 } as React.TdHTMLAttributes<HTMLTableCellElement>} className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
                                    <Text className="ml-2">Loading sizing data...</Text>
                                </Table.Cell>
                            </Table.Row>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((d) => (
                                <SizingDetailRow
                                    key={d.id}
                                    data={d}
                                    isExpanded={expandedId === d.id}
                                    onToggle={() => handleToggle(d.id)}
                                />
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell {...{ colSpan: 5 } as React.TdHTMLAttributes<HTMLTableCellElement>} className="text-center py-8">
                                    <Text className="text-gray-500">
                                        {searchTerm || sizeFilter ? "No data matches your filters" : "No sizing data found"}
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>

            {/* Results count */}
            <div className="mt-4">
                <Text className="text-sm text-gray-500">
                    Showing {filteredData.length} of {sizingData.length} records
                </Text>
            </div>
        </Container>
    )
}


export default SizingPage
