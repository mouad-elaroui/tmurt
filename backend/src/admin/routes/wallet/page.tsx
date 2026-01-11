"use client"

import { Container, Heading, Table, Text, Badge, Button, Input } from "@medusajs/ui"
import { RouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState, useMemo, type ReactNode } from "react"

// Typo dyal wallet - strict TypeScript
interface WalletMetadata {
    source?: string
    last_transaction?: {
        type: "credit" | "debit"
        amount: number
        timestamp?: string
    }
}

interface Wallet {
    id: string
    customer_id: string
    balance: number
    currency_code: string
    metadata?: WalletMetadata
}

interface WalletStats {
    totalWallets: number
    totalBalance: number
    avgBalance: number
    currencies: Record<string, number>
}

interface StatCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: ReactNode
}

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon }: StatCardProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
            <div>
                <Text className="text-sm text-gray-500">{title}</Text>
                <Heading level="h3" className="text-2xl font-bold mt-1">
                    {value}
                </Heading>
                {subtitle && (
                    <Text className="text-xs text-gray-400 mt-1">{subtitle}</Text>
                )}
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">{icon}</div>
        </div>
    </div>
)

interface WalletDetailModalProps {
    wallet: Wallet | null
    onClose: () => void
}

// Modal dyal tafasil l-wallet
const WalletDetailModal = ({ wallet, onClose }: WalletDetailModalProps) => {
    // Early return - modern pattern
    if (!wallet) return null

    const transaction = wallet.metadata?.last_transaction
    const transactions = transaction ? [transaction] : []

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Heading level="h3" className="text-white">
                            Wallet Details
                        </Heading>
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
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Text className="text-sm text-gray-500">Wallet ID</Text>
                            <Text className="font-mono text-sm">{wallet.id}</Text>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <Text className="text-sm text-gray-500">Customer ID</Text>
                            <Text className="font-mono text-sm">{wallet.customer_id}</Text>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <Text className="text-sm text-amber-700">Current Balance</Text>
                            <Text className="text-2xl font-bold text-amber-800">
                                {Number(wallet.balance).toFixed(2)} {wallet.currency_code}
                            </Text>
                        </div>

                        {transactions.length > 0 && (
                            <div>
                                <Text className="font-medium mb-2">Recent Activity</Text>
                                {transactions.map((tx, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm">
                                        <div className="flex justify-between">
                                            <Badge color={tx.type === "credit" ? "green" : "red"}>
                                                {tx.type.toUpperCase()}
                                            </Badge>
                                            <Text>{tx.amount} {wallet.currency_code}</Text>
                                        </div>
                                        {tx.timestamp && (
                                            <Text className="text-xs text-gray-400 mt-1">
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </Text>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

type SortField = "balance" | "customer_id"
type SortOrder = "asc" | "desc"

const WalletPage = () => {
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState<SortField>("balance")
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)

    // Fetch wallets - async function
    const fetchWallets = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/admin/wallets")
            const data = await res.json()
            setWallets(data.wallets ?? [])
        } catch (err) {
            console.error("Khata f fetch wallets:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchWallets()
    }, [])

    // Calculate stats - useMemo bach ma n3awdouch lhsab kol render
    const stats = useMemo<WalletStats>(() => {
        const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)
        const currencies = wallets.reduce<Record<string, number>>((acc, w) => {
            const code = w.currency_code || "MAD"
            acc[code] = (acc[code] ?? 0) + Number(w.balance)
            return acc
        }, {})

        return {
            totalWallets: wallets.length,
            totalBalance,
            avgBalance: wallets.length > 0 ? totalBalance / wallets.length : 0,
            currencies
        }
    }, [wallets])

    // Filter w sort wallets
    const filteredWallets = useMemo(() => {
        const term = searchTerm.toLowerCase()

        return [...wallets]
            .filter(w =>
                !searchTerm ||
                w.id.toLowerCase().includes(term) ||
                w.customer_id.toLowerCase().includes(term)
            )
            .sort((a, b) => {
                const multiplier = sortOrder === "asc" ? 1 : -1

                return sortBy === "balance"
                    ? (Number(a.balance) - Number(b.balance)) * multiplier
                    : a.customer_id.localeCompare(b.customer_id) * multiplier
            })
    }, [wallets, searchTerm, sortBy, sortOrder])

    // Handle sort - toggle order wla beddel column
    const handleSort = (column: SortField) => {
        setSortBy(column)
        setSortOrder(prev =>
            sortBy === column
                ? (prev === "asc" ? "desc" : "asc")
                : "desc"
        )
    }

    // Helper bash n-formattiw balance badge color
    const getBalanceColor = (balance: number) => {
        if (balance > 100) return "green"
        if (balance > 0) return "orange"
        return "grey"
    }

    return (
        <Container className="p-8">
            {/* Page Header */}
            <div className="mb-8">
                <Heading level="h1" className="text-3xl font-bold mb-2">
                    Wallet Management
                </Heading>
                <Text className="text-gray-500">
                    Monitor and manage customer wallet balances
                </Text>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Wallets"
                    value={stats.totalWallets}
                    subtitle="Active customer wallets"
                    icon={
                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Total Balance"
                    value={`${stats.totalBalance.toFixed(2)} MAD`}
                    subtitle="Across all wallets"
                    icon={
                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Average Balance"
                    value={`${stats.avgBalance.toFixed(2)} MAD`}
                    subtitle="Per wallet average"
                    icon={
                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Currencies"
                    value={Object.keys(stats.currencies).length}
                    subtitle={Object.keys(stats.currencies).join(", ") || "No data"}
                    icon={
                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex gap-4 items-center">
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by ID or Customer ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="secondary" onClick={fetchWallets}>
                    Refresh
                </Button>
            </div>

            {/* Wallets Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Wallet ID</Table.HeaderCell>
                            <Table.HeaderCell
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort("customer_id")}
                            >
                                Customer ID {sortBy === "customer_id" && (sortOrder === "asc" ? "↑" : "↓")}
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort("balance")}
                            >
                                Balance {sortBy === "balance" && (sortOrder === "asc" ? "↑" : "↓")}
                            </Table.HeaderCell>
                            <Table.HeaderCell>Currency</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            <Table.Row>
                                <Table.Cell {...{ colSpan: 5 } as React.TdHTMLAttributes<HTMLTableCellElement>} className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
                                    <Text className="ml-2">Loading wallets...</Text>
                                </Table.Cell>
                            </Table.Row>
                        ) : filteredWallets.length > 0 ? (
                            filteredWallets.map((w) => (
                                <Table.Row
                                    key={w.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedWallet(w)}
                                >
                                    <Table.Cell className="font-mono text-sm">
                                        {w.id.slice(0, 16)}...
                                    </Table.Cell>
                                    <Table.Cell className="font-mono text-sm">
                                        {w.customer_id.slice(0, 16)}...
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge color={getBalanceColor(Number(w.balance))}>
                                            {Number(w.balance).toFixed(2)}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge>{w.currency_code || "MAD"}</Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedWallet(w)
                                            }}
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
                                        {searchTerm ? "No wallets match your search" : "No wallets found"}
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>

            {/* Results count */}
            <div className="mt-4 flex justify-between items-center">
                <Text className="text-sm text-gray-500">
                    Showing {filteredWallets.length} of {wallets.length} wallets
                </Text>
            </div>

            {/* Wallet Detail Modal */}
            {selectedWallet && (
                <WalletDetailModal
                    wallet={selectedWallet}
                    onClose={() => setSelectedWallet(null)}
                />
            )}
        </Container>
    )
}


export default WalletPage
