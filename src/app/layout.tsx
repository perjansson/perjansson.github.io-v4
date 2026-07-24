import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import './globals.css'

const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID

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
  themeColor: '#171511',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.dataset.theme='light'}}catch(e){}",
          }}
        />
        {children}
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}
