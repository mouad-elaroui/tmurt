/**
 * Dashboard Welcome Widget - Moroccan Branded Header
 * Appears at the top of the main dashboard
 */

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

const DashboardWelcome = () => {
    const [greeting, setGreeting] = useState("Welcome")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Good Morning")
        else if (hour < 18) setGreeting("Good Afternoon")
        else setGreeting("Good Evening")
    }, [])

    return (
        <div
            style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                borderRadius: "16px",
                padding: "32px",
                marginBottom: "24px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            }}
        >
            {/* Moroccan Pattern Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.4'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    {/* Logo/Brand */}
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #d4af37 0%, #b8963e 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)",
                        }}
                    >
                        <span style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>ت</span>
                    </div>
                    <div>
                        <h1
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "white",
                                margin: 0,
                                lineHeight: 1.2,
                            }}
                        >
                            {greeting}!
                        </h1>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.7)",
                                margin: "4px 0 0 0",
                            }}
                        >
                            Tmurt Admin Dashboard
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "16px",
                        marginTop: "24px",
                    }}
                >
                    <StatCard label="Orders Today" value="—" icon="📦" />
                    <StatCard label="Revenue" value="—" icon="💰" />
                    <StatCard label="Products" value="—" icon="🏷️" />
                    <StatCard label="Customers" value="—" icon="👥" />
                </div>
            </div>

            {/* Decorative Corner Accent */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "120px",
                    height: "120px",
                    background: "linear-gradient(225deg, rgba(212, 175, 55, 0.2) 0%, transparent 70%)",
                    borderRadius: "0 16px 0 100%",
                }}
            />
        </div>
    )
}

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <div
        style={{
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid rgba(212, 175, 55, 0.15)",
        }}
    >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase" }}>{label}</span>
        </div>
        <span style={{ fontSize: "20px", fontWeight: "600", color: "#d4af37" }}>{value}</span>
    </div>
)

export const config = defineWidgetConfig({
    zone: "order.list.before",
})

export default DashboardWelcome
