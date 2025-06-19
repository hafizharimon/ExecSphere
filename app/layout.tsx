import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { PerformanceTracker } from "@/components/performance-tracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ExecSphere - Global Executive Network",
  description: "A global sphere of executive minds connecting C-level professionals worldwide",
  keywords: ["executives", "networking", "leadership", "C-level", "business"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <AnalyticsProvider>
                <PerformanceTracker />
                {children}
                <Toaster />
              </AnalyticsProvider>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
