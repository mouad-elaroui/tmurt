import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// SSL ghir lproduction - local ma khass-hach SSL
const isProduction = process.env.NODE_ENV === 'production'
const useSSL = isProduction || process.env.DATABASE_URL?.includes('sslmode=require')

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    ...(useSSL && {
      databaseDriverOptions: {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      },
    }),
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: process.env.DISABLE_ADMIN === "true",
  },
  modules: [
    // Payment provider - Stripe l-checkout (optional - loads only with valid API key)
    ...(process.env.STRIPE_API_KEY && !process.env.STRIPE_API_KEY.includes('placeholder') ? [{
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              // automatic_payment_methods bach n-supportiw Google Pay w Apple Pay
              automatic_payment_methods: true,
              capture: true,
            },
          },
        ],
      },
    }] : []),
    // Custom modules
    {
      resolve: "./src/modules/wallet",
    },
    {
      resolve: "./src/modules/digital-passport",
    },
    {
      resolve: "./src/modules/sizing",
    },
    {
      resolve: "./src/modules/family-sync",
    },
  ]
})
