import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/navigation/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PPYTECH Dashboard',
  description: 'Financial Dashboard Application built with Next.js, TypeScript, and shadcn/ui',
  keywords: ['dashboard', 'finance', 'portfolio', 'investment', 'analytics'],
  authors: [{ name: 'PPYTECH' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative min-h-screen bg-background">
          {/* Sidebar Navigation */}
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="transition-all duration-300 md:ml-64">
            {/* Responsive Content Container */}
            <div className="min-h-screen">
              {/* Top padding for mobile header */}
              <div className="h-16 md:hidden" />
              
              {/* Page Content with responsive padding */}
              <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Dashboard Grid Container */}
                <div className="mx-auto max-w-7xl">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
