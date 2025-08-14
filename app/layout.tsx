import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/navigation/sidebar'
import { TodoProvider } from '@/lib/todo-context'
import { Toaster } from '@/components/ui/toaster'

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
        <TodoProvider>
          <div className="relative min-h-screen bg-background">
            {/* The sidebar that follows you everywhere */}
            <Sidebar />
            
            {/* This is where the magic happens */}
            <main className="transition-all duration-300 md:ml-64">
              {/* Making sure content fits nicely on all screens */}
              <div className="min-h-screen">
                {/* Space for mobile menu button */}
                <div className="h-16 md:hidden" />
                
                {/* Content wrapper with proper spacing */}
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                  {/* Keep everything centered and tidy */}
                  <div className="mx-auto max-w-7xl">
                    {children}
                  </div>
                </div>
              </div>
            </main>
          </div>
          <Toaster />
        </TodoProvider>
      </body>
    </html>
  )
}
