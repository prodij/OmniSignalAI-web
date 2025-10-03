import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://omnisignalai.com'),
  title: 'OmniSignalAI - Transform Social Media Content Creation',
  description: 'Generate complete social media campaigns with text and images in 30 seconds. AI-powered platform that transforms content creation from hours to seconds.',
  keywords: ['AI', 'social media', 'content creation', 'marketing', 'automation'],
  authors: [{ name: 'OmniSignalAI Team' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://omnisignalai.com',
    title: 'OmniSignalAI - Transform Social Media Content Creation',
    description: 'Generate complete social media campaigns with text and images in 30 seconds.',
    siteName: 'OmniSignalAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniSignalAI - Transform Social Media Content Creation',
    description: 'Generate complete social media campaigns with text and images in 30 seconds.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Only apply dark mode on dashboard pages if explicitly set
                  if (window.location.pathname.startsWith('/dashboard')) {
                    var darkMode = localStorage.getItem('darkMode');
                    if (darkMode === 'true') {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}