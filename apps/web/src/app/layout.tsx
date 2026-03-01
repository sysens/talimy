import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { getLocale, getMessages } from "next-intl/server"
import type { ReactNode } from "react"

import { getWebOrigin, SITE_NAME } from "@/config/site"
import { AuthProvider } from "@/providers/auth-provider"
import { IntlProvider } from "@/providers/intl-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { auth } from "@/lib/nextauth"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(getWebOrigin()),
  title: SITE_NAME,
  description: "Multi-tenant school management platform for Uzbekistan schools",
}

type RootLayoutProps = {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [locale, messages, session] = await Promise.all([getLocale(), getMessages(), auth()])

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider session={session}>
            <IntlProvider locale={locale} messages={messages}>
              {children}
            </IntlProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
