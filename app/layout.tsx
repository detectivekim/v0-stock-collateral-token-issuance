import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/privy-provider"
import { I18nProvider } from "@/lib/i18n-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Seesaw Finance - Stock-Collateralized Lending Platform",
  description: "Borrow KRW1 tokens using your stocks as collateral and trade cryptocurrencies",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('ethereum')) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <I18nProvider>
            <AuthProvider>{children}</AuthProvider>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  )
}
