import type { Metadata } from 'next'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VCScout — VC Intelligence Interface',
  description: 'Precision AI scouting for venture capital teams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-ink text-white antialiased">{children}</body>
    </html>
  )
}
