import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/privy-provider"
import { I18nProvider } from "@/lib/i18n-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Seesaw Finance - Stock-Collateralized Lending Platform",
  description: "Borrow KRW1 tokens using your stocks as collateral and trade cryptocurrencies",
  icons: {
    icon: "/logo.png",
  },
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
                const msg = (e.message || '').toLowerCase();
                const errorName = (e.error?.name || '').toLowerCase();
                if (
                  msg.includes('ethereum') || 
                  msg.includes('privy') ||
                  msg.includes('cross-origin') ||
                  msg.includes('blocked a frame') ||
                  msg.includes('failed to read') ||
                  msg.includes('securityerror') ||
                  msg.includes('walletconnector') ||
                  errorName === 'securityerror'
                ) {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return false;
                }
              }, true);
              
              window.addEventListener('unhandledrejection', function(e) {
                const msg = (e.reason?.message || '').toLowerCase();
                const errorName = (e.reason?.name || '').toLowerCase();
                if (
                  msg.includes('auth.privy.io') ||
                  msg.includes('timeouterror') ||
                  msg.includes('ethereum') ||
                  msg.includes('cross-origin') ||
                  msg.includes('blocked a frame') ||
                  msg.includes('failed to read') ||
                  msg.includes('securityerror') ||
                  msg.includes('walletconnector') ||
                  errorName === 'securityerror' ||
                  e.reason?.code === 'api_error'
                ) {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return false;
                }
              }, true);
              
              // Override console.error to suppress Privy errors
              const originalError = console.error;
              console.error = function(...args) {
                const msg = args.join(' ').toLowerCase();
                if (
                  msg.includes('ethereum') ||
                  msg.includes('privy') ||
                  msg.includes('cross-origin') ||
                  msg.includes('blocked a frame') ||
                  msg.includes('securityerror') ||
                  msg.includes('walletconnector')
                ) {
                  return;
                }
                originalError.apply(console, args);
              };
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
