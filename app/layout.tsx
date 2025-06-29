import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CollegeEssayAI - AI College Admission Essay Generator',
  description: 'Transform your college application with AI-powered essay generation and expert analysis',
  keywords: ['college', 'essay', 'ai', 'admissions', 'education', 'writing'],
  authors: [{ name: 'CollegeEssayAI' }],
  creator: 'CollegeEssayAI',
  openGraph: {
    title: 'CollegeEssayAI - AI College Admission Essay Generator',
    description: 'Transform your college application with AI-powered essay generation and expert analysis',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CollegeEssayAI - AI College Admission Essay Generator',
    description: 'Transform your college application with AI-powered essay generation and expert analysis',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎓</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Background Particles */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        {children}
      </body>
    </html>
  )
} 