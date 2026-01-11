import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { SmoothScrollProvider } from "@lib/context/smooth-scroll-provider"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Tmurt - تمورت | Authentic Amazigh Traditional Clothing",
  description: "Discover handcrafted traditional Moroccan garments. Kaftans, Djellabas, Takchitas, and more delivered across Morocco.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Outfit', sans-serif;
          }
        `}</style>
      </head>
      <body suppressHydrationWarning>
        <SmoothScrollProvider>
          <main className="relative">{props.children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
