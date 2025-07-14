import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Layout from '@/components/layout/layout'
import { ProjectHeaderProvider } from './project-header-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roof Construction Manager',
  description: 'Manage your roof construction projects efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-[#f6f8fa] text-gray-900 antialiased ${inter.className}`}>
        <Providers>
          <ProjectHeaderProvider>
            <Layout>
              {children}
            </Layout>
          </ProjectHeaderProvider>
        </Providers>
      </body>
    </html>
  )
}