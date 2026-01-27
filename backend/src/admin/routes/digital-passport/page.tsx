"use client"

import { Container, Heading, Table, Text, Badge, Button, Input } from "@medusajs/ui"
import { useEffect, useState, useMemo, type ChangeEvent, type MouseEvent } from "react"

// Types dyal passports
type PassportStatus = "active" | "verified" | "revoked"

interface DigitalPassport {
    id: string
    token_id: string
    order_id: string
    created_at?: string
    status?: PassportStatus
}

interface PassportStats {
    total: number
    active: number
    verified: number
    revoked: number
}

interface QRPreviewProps {
    tokenId: string
}

// QR Code Preview
const QRPreview = ({ tokenId }: QRPreviewProps) => (
    <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-0.5">
            {Array.from({ length: 25 }, (_, i) => (
                <div
                    key={i}
                    className={`w-3 h-3 ${tokenId.charCodeAt(i % tokenId.length) % 2 === 0 ? "bg-gray-900" : "bg-white"}`}
                />
            ))}
        </div>
    </div>
)

interface PassportDetailModalProps {
    passport: DigitalPassport | null
    onClose: () => void
    onRevoke: (id: string) => void
}

// Helper bash n-jobo color dyal status
const getStatusColor = (status?: PassportStatus): "green" | "red" | "blue" => {
    if (status === "verified") return "green"
    if (status === "revoked") return "red"
    return "blue"
}

// Modal dyal tafasil l-passport
const PassportDetailModal = ({ passport, onClose, onRevoke }: PassportDetailModalProps) => {
    // Early return pattern
    if (!passport) return null

    const handleViewOrder = () => {
        window.open(`/orders/${passport.order_id}`, "_blank")
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <Heading level="h3" className="text-white">
                                Passport Details
                            </Heading>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white"
                            type="button"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    {/* QR Preview */}
                    <div className="flex justify-center mb-6">
                        <QRPreview tokenId={passport.token_id} />
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Text className="text-sm text-gray-500">Token ID</Text>
                            <Text className="font-mono text-sm font-bold text-amber-600">
                                {passport.token_id}
                            </Text>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Text className="text-sm text-gray-500">Order ID</Text>
                            <Text className="font-mono text-sm">{passport.order_id}</Text>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                <Text className="text-sm text-gray-500">Status</Text>
                                <Badge color={getStatusColor(passport.status)}>
                                    {passport.status ?? "Active"}
                                </Badge>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                <Text className="text-sm text-gray-500">Created</Text>
                                <Text className="text-sm">
                                    {passport.created_at
                                        ? new Date(passport.created_at).toLocaleDateString()
                                        : "N/A"
                                    }
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={handleViewOrder}
                        >
                            View Order
                        </Button>
                        {passport.status !== "revoked" && (
                            <Button
                                variant="danger"
                                className="flex-1"
                                onClick={() => onRevoke(passport.id)}
                            >
                                Revoke Passport
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const PassportPage = () => {
    const [passports, setPassports] = useState<DigitalPassport[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [selectedPassport, setSelectedPassport] = useState<DigitalPassport | null>(null)

    // Fetch passports
    const fetchPassports = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/admin/digital-passports")
            const data = await res.json()
            setPassports(data.digital_passports ?? [])
        } catch (err) {
            console.error("Khata f fetch passports:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPassports()
    }, [])

    // Statistics - calculated b reduce
    const stats = useMemo<PassportStats>(() => ({
        total: passports.length,
        active: passports.filter(p => !p.status || p.status === "active").length,
        verified: passports.filter(p => p.status === "verified").length,
        revoked: passports.filter(p => p.status === "revoked").length
    }), [passports])

    // Filter passports
    const filteredPassports = useMemo(() => {
        const term = searchTerm.toLowerCase()

        return passports
            .filter(p =>
                !searchTerm ||
                p.id.toLowerCase().includes(term) ||
                p.token_id.toLowerCase().includes(term) ||
                p.order_id.toLowerCase().includes(term)
            )
            .filter(p => !statusFilter || (p.status ?? "active") === statusFilter)
    }, [passports, searchTerm, statusFilter])

    // Revoke handler
    const handleRevoke = (id: string) => {
        setPassports(prev => prev.map(p =>
            p.id === id ? { ...p, status: "revoked" as const } : p
        ))
        setSelectedPassport(null)
    }

    // Row click handler
    const handleRowClick = (passport: DigitalPassport) => {
        setSelectedPassport(passport)
    }

    // View button click - prevent row click
    const handleViewClick = (e: MouseEvent, passport: DigitalPassport) => {
        e.stopPropagation()
        setSelectedPassport(passport)
    }

    return (
        <Container className="p-8">
            {/* Page Header */}
            <div className="mb-8">
                <Heading level="h1" className="text-3xl font-bold mb-2">
                    Digital Passports
                </Heading>
                <Text className="text-gray-500">
                    Manage product authenticity certificates
                </Text>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <Text className="text-sm text-gray-500">Total</Text>
                            <Heading level="h3" className="text-xl font-bold">{stats.total}</Heading>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Badge color="blue">Active</Badge>
                        <Heading level="h3" className="text-xl font-bold">{stats.active}</Heading>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Badge color="green">Verified</Badge>
                        <Heading level="h3" className="text-xl font-bold">{stats.verified}</Heading>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Badge color="red">Revoked</Badge>
                        <Heading level="h3" className="text-xl font-bold">{stats.revoked}</Heading>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by Token ID, Order ID..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="verified">Verified</option>
                    <option value="revoked">Revoked</option>
                </select>
                <Button variant="secondary" onClick={fetchPassports}>
                    Refresh
                </Button>
            </div>

            {/* Passports Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Token ID</Table.HeaderCell>
                            <Table.HeaderCell>Order ID</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Created</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            <Table.Row>
                                <Table.Cell {...{ colSpan: 5 } as React.TdHTMLAttributes<HTMLTableCellElement>} className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
                                    <Text className="ml-2">Loading passports...</Text>
                                </Table.Cell>
                            </Table.Row>
                        ) : filteredPassports.length > 0 ? (
                            filteredPassports.map((p) => (
                                <Table.Row
                                    key={p.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(p)}
                                >
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <Text className="font-mono text-sm font-medium">
                                                {p.token_id}
                                            </Text>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="font-mono text-sm">
                                        {p.order_id.slice(0, 16)}...
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge color={getStatusColor(p.status)}>
                                            {p.status ?? "Active"}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {p.created_at
                                            ? new Date(p.created_at).toLocaleDateString()
                                            : "N/A"
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={(e) => handleViewClick(e, p)}
                                        >
                                            View
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell {...{ colSpan: 5 } as React.TdHTMLAttributes<HTMLTableCellElement>} className="text-center py-8">
                                    <Text className="text-gray-500">
                                        {searchTerm || statusFilter ? "No passports match your filters" : "No passports found"}
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
                    Showing {filteredPassports.length} of {passports.length} passports
                </Text>
            </div>

            {/* Passport Detail Modal */}
            {selectedPassport && (
                <PassportDetailModal
                    passport={selectedPassport}
                    onClose={() => setSelectedPassport(null)}
                    onRevoke={handleRevoke}
                />
            )}
        </Container>
    )
}


export default PassportPage
