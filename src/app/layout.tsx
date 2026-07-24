import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/playfair-display'
import '@fontsource-variable/inter'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.perjansson.me'),
  title: '✨ Per Jansson - Fullstack Web Developer ✨',
  description:
    "I'm Per, a curious software developer with a passion to build great applications and websites - and help others do the same.",
  openGraph: {
    title: '✨ Per Jansson - Fullstack Web Developer ✨',
    description:
      "I'm Per, a curious software developer with a passion to build great applications and websites - and help others do the same.",
    images: ['/images/social-media.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '✨ Per Jansson - Fullstack Web Developer ✨',
    description:
      "I'm Per, a curious software developer with a passion to build great applications and websites - and help others do the same.",
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#12150f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
