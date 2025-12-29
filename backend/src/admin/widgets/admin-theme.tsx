/**
 * Global Moroccan Theme Styles for Admin Dashboard
 * Injects custom CSS to style the Medusa admin with Tmurt branding
 * REVERTED to Lighter Cream/Gold Aesthetics per user preference
 */

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

// Moroccan theme CSS to inject globally (Light/Cream Version)
const moroccanAdminStyles = `
  /* ============================================
     TMURT Admin - Light Moroccan Theme
     ============================================ */

  /* Login Page - Light & Airy */
  .login-page, [data-testid="login-view"], body:has(form[action*="login"]) {
    background: linear-gradient(135deg, #fdfbf7 0%, #f0e4cc 100%) !important;
  }

  /* Primary Color Overrides - Gold Theme */
  :root {
    --ui-fg-interactive: #d4af37 !important;
    --ui-fg-interactive-hover: #b8963e !important;
    --ui-bg-interactive: #d4af37 !important;
    --ui-border-interactive: #d4af37 !important;
  }

  /* Navigation Sidebar - Dark but Clean */
  [data-testid="nav-sidebar"], nav[aria-label="Main"] {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%) !important;
    border-right: 1px solid rgba(212, 175, 55, 0.2) !important;
  }

  /* Sidebar Branding Text */
  [data-testid="nav-store-name"] {
    color: #d4af37 !important;
  }

  /* Sidebar Links */
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

  /* Primary Buttons - Gold Gradient */
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

  /* Table Header Styling */
  th, [role="columnheader"] {
    background: linear-gradient(135deg, #fdfbf7 0%, #f9f3e8 100%) !important;
    color: #8b7355 !important;
    font-weight: 600 !important;
  }

  /* Loading Spinner */
  .animate-spin {
    color: #d4af37 !important;
  }
`;

// Widget component that injects styles on mount
const AdminThemeInjector = () => {
  useEffect(() => {
    // 1. Text Replacement Logic (Keep this from correct version)
    const updateStoreNameUI = () => {
      const storeNameEls = document.querySelectorAll('[data-testid="nav-store-name"], .font-medium.text-small')
      storeNameEls.forEach(el => {
        if (el.textContent?.includes("Medusa Store")) {
          el.textContent = "Tmurt"
        }
      })
    }
    const interval = setInterval(updateStoreNameUI, 1000)

    // 2. Style Injection
    const existingStyles = document.getElementById("tmurt-admin-styles")
    if (existingStyles) {
      existingStyles.textContent = moroccanAdminStyles
      return
    }

    const styleElement = document.createElement("style")
    styleElement.id = "tmurt-admin-styles"
    styleElement.textContent = moroccanAdminStyles
    document.head.appendChild(styleElement)

    return () => clearInterval(interval)
  }, [])

  return null
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default AdminThemeInjector
