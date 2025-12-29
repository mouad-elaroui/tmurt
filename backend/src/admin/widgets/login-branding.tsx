/**
 * Login Page Branding Widget
 * Injects Moroccan styling into the login page
 */

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

// Custom login page styles
const loginStyles = `
  /* Login Page Complete Restyle */
  
  /* Background with Moroccan Pattern */
  body:has([data-testid="login-card"]),
  body:has(form[action*="login"]),
  [data-testid="login-view"],
  .login-container {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
    min-height: 100vh !important;
    position: relative !important;
  }

  /* Add pattern overlay to login */
  body:has([data-testid="login-card"])::before,
  body:has(form[action*="login"])::before {
    content: '';
    position: fixed;
    inset: 0;
    opacity: 0.1;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.5'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  /* Login Card Styling */
  [data-testid="login-card"],
  .login-card,
  form[action*="login"] {
    background: white !important;
    border-radius: 20px !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(212, 175, 55, 0.2) !important;
    position: relative !important;
    z-index: 1 !important;
  }

  /* Logo Area Enhancement */
  [data-testid="login-card"] > div:first-child,
  .login-card > div:first-child {
    background: linear-gradient(135deg, #fdfbf7 0%, #f9f3e8 100%) !important;
    border-bottom: 1px solid rgba(212, 175, 55, 0.2) !important;
    padding: 32px !important;
  }

  /* Input Fields */
  [data-testid="login-card"] input,
  form[action*="login"] input {
    border: 2px solid #e8e0d5 !important;
    border-radius: 10px !important;
    padding: 14px 16px !important;
    transition: all 0.3s ease !important;
  }

  [data-testid="login-card"] input:focus,
  form[action*="login"] input:focus {
    border-color: #d4af37 !important;
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.15) !important;
    outline: none !important;
  }

  /* Labels */
  [data-testid="login-card"] label,
  form[action*="login"] label {
    color: #6b5a42 !important;
    font-weight: 500 !important;
  }

  /* Login Button */
  [data-testid="login-card"] button[type="submit"],
  form[action*="login"] button[type="submit"] {
    background: linear-gradient(135deg, #d4af37 0%, #b8963e 100%) !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 14px 24px !important;
    font-weight: 600 !important;
    color: white !important;
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3) !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
  }

  [data-testid="login-card"] button[type="submit"]:hover,
  form[action*="login"] button[type="submit"]:hover {
    background: linear-gradient(135deg, #b8963e 0%, #8b7355 100%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4) !important;
  }

  /* Error Messages */
  [data-testid="login-card"] [role="alert"],
  form[action*="login"] [role="alert"] {
    background: #fef2f2 !important;
    border: 1px solid #fecaca !important;
    border-radius: 8px !important;
    color: #dc2626 !important;
  }

  /* Forgot Password Link */
  [data-testid="login-card"] a,
  form[action*="login"] a {
    color: #b8963e !important;
    font-weight: 500 !important;
  }

  [data-testid="login-card"] a:hover,
  form[action*="login"] a:hover {
    color: #d4af37 !important;
    text-decoration: underline !important;
  }

  /* Add Tmurt branding text */
  [data-testid="login-card"]::after {
    content: 'Tmurt Admin';
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    font-weight: 500;
  }
`;

const LoginBranding = () => {
    useEffect(() => {
        // Check if styles already injected
        const existingStyles = document.getElementById("tmurt-login-styles")
        if (existingStyles) return

        // Inject login-specific styles
        const styleElement = document.createElement("style")
        styleElement.id = "tmurt-login-styles"
        styleElement.textContent = loginStyles
        document.head.appendChild(styleElement)

        return () => {
            const el = document.getElementById("tmurt-login-styles")
            if (el) el.remove()
        }
    }, [])

    return null
}

// This will load on product and order pages but inject globally
export const config = defineWidgetConfig({
    zone: "product.list.before",
})

export default LoginBranding
