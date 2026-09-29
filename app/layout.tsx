import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic, Montserrat } from 'next/font/google'
import './globals.css'

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'STARTECH — كل ما تحتاجه... في مكان واحد',
  description:
    'إعلان STARTECH: صيانة الحواسيب، مستلزمات الهواتف، منتجات الإعلام الآلي، الأدوات المدرسية، طباعة الوثائق، شحن الألعاب، فليكسي وإنترنت.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0f1114',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${plexArabic.variable} ${montserrat.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
