// tmurt admin theme styles

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const themeStyles = `
  :root {
    --ui-fg-interactive: #d4af37 !important;
    --ui-fg-interactive-hover: #b8963e !important;
    --ui-bg-interactive: #d4af37 !important;
    --ui-border-interactive: #d4af37 !important;
  }

  [data-testid="nav-sidebar"], nav[aria-label="Main"] {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%) !important;
    border-right: 1px solid rgba(212, 175, 55, 0.2) !important;
  }

  [data-testid="nav-store-name"] {
    color: #d4af37 !important;
  }

  [data-testid="nav-sidebar"] a, nav[aria-label="Main"] a {
    color: #e8e8e8 !important;
    transition: all 0.2s ease !important;
  }

  [data-testid="nav-sidebar"] a:hover, nav[aria-label="Main"] a:hover {
    color: #d4af37 !important;
    background: rgba(212, 175, 55, 0.1) !important;
  }

  [data-testid="nav-sidebar"] a[data-active="true"], nav[aria-label="Main"] a[data-active="true"] {
    background: linear-gradient(90deg, rgba(212, 175, 55, 0.2) 0%, transparent 100%) !important;
    border-left: 3px solid #d4af37 !important;
    color: #d4af37 !important;
  }

  button[data-variant="primary"], .ui-button-primary, [data-testid="submit-button"] {
    background: linear-gradient(135deg, #d4af37 0%, #b8963e 100%) !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3) !important;
  }

  button[data-variant="primary"]:hover, .ui-button-primary:hover {
    background: linear-gradient(135deg, #b8963e 0%, #8b7355 100%) !important;
    transform: translateY(-1px) !important;
  }

  th, [role="columnheader"] {
    background: linear-gradient(135deg, #fdfbf7 0%, #f9f3e8 100%) !important;
    color: #8b7355 !important;
    font-weight: 600 !important;
  }

  .animate-spin {
    color: #d4af37 !important;
  }
`

const updateStoreName = () => {
  document.querySelectorAll('[data-testid="nav-store-name"], .font-medium.text-small').forEach((el) => {
    if (el.textContent?.includes("Medusa Store")) el.textContent = "Tmurt"
  })
}

const AdminThemeInjector = () => {
  useEffect(() => {
    const interval = setInterval(updateStoreName, 1000)

    const existing = document.getElementById("tmurt-admin-styles")
    if (existing) {
      existing.textContent = themeStyles
      return () => clearInterval(interval)
    }

    const style = document.createElement("style")
    style.id = "tmurt-admin-styles"
    style.textContent = themeStyles
    document.head.appendChild(style)

    return () => clearInterval(interval)
  }, [])

  return null
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default AdminThemeInjector
