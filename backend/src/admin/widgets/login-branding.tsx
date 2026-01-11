// tmurt login page branding

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const loginStyles = `
  body:has([data-testid="login-card"]),
  body:has(form[action*="login"]),
  [data-testid="login-view"],
  .login-container {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
    min-height: 100vh !important;
    position: relative !important;
  }

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

  [data-testid="login-card"] > div:first-child,
  .login-card > div:first-child {
    background: linear-gradient(135deg, #fdfbf7 0%, #f9f3e8 100%) !important;
    border-bottom: 1px solid rgba(212, 175, 55, 0.2) !important;
    padding: 32px !important;
  }

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

  [data-testid="login-card"] label,
  form[action*="login"] label {
    color: #6b5a42 !important;
    font-weight: 500 !important;
  }

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
  }

  [data-testid="login-card"] button[type="submit"]:hover,
  form[action*="login"] button[type="submit"]:hover {
    background: linear-gradient(135deg, #b8963e 0%, #8b7355 100%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4) !important;
  }

  [data-testid="login-card"] a,
  form[action*="login"] a {
    color: #b8963e !important;
  }

  [data-testid="login-card"] a:hover,
  form[action*="login"] a:hover {
    color: #d4af37 !important;
  }

  [data-testid="login-card"]::after {
    content: 'Tmurt Admin';
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }
`

const LoginBranding = () => {
  useEffect(() => {
    const existing = document.getElementById("tmurt-login-styles")
    if (existing) return

    const style = document.createElement("style")
    style.id = "tmurt-login-styles"
    style.textContent = loginStyles
    document.head.appendChild(style)

    return () => document.getElementById("tmurt-login-styles")?.remove()
  }, [])

  return null
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default LoginBranding
