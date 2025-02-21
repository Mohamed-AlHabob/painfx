import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from "sonner";
import "./globals.css";
import Provider from '@/redux/provider';
import Setup from "@/lib/Setup";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ReactQueryProvider } from "@/components/providers/provider";
import 'leaflet/dist/leaflet.css';
import TranslationsProvider from "@/components/providers/TranslationsProvider";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://painfx.in'),
  title: {
    default: 'PainFX: Leading Community for Pain Management Professionals',
    template: '%s | PainFX - Pain Management Network'
  },
  description: 'PainFX connects doctors, hospitals, and clinics specializing in pain management. Join our professional network for collaboration, resources, and advanced treatment insights.',
  keywords: ['PainFX', 'pain management', 'medical community', 'doctors network', 'hospitals', 'clinics', 'chronic pain', 'pain treatment', 'medical professionals', 'healthcare collaboration'],
  authors: [{ name: 'Supernova Team', url: 'https://painfx.in/team' }],
  creator: 'PainFX',
  publisher: 'Supernova Inc.',
  alternates: {
    canonical: 'https://painfx.in',
    languages: {
      'en-US': 'https://painfx.in',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://painfx.in',
    siteName: 'PainFX',
    title: 'PainFX: Leading Community for Pain Management Professionals',
    description: 'Connect with top pain management specialists, hospitals, and clinics. Access resources, share insights, and advance your practice on PainFX.',
    images: [
      {
        url: 'https://painfx.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PainFX - Professional Pain Management Community'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@PainFX',
    creator: '@PainFX',
    title: 'PainFX: Leading Community for Pain Management Professionals',
    description: 'Join PainFX to connect with top pain management specialists, access resources, and advance your practice. The premier network for medical professionals.',
    images: ['https://painfx.in/twitter-card.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5'
      },
    ],
  },
  manifest: '/site.webmanifest',
  applicationName: 'PainFX',
  category: 'Medical',
  classification: 'Professional Network',
  referrer: 'origin-when-cross-origin',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification#',
    yandex: 'yandex-verification#',
    me: ['info@painfx.in'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.className} bg-slate-100 dark:bg-black scrollbar-thin scrollbar-webkit`}>
        <Provider>
          <TranslationsProvider locale="en">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="painfx-theme"
            >
              <Setup />
              <ModalProvider />
              <Toaster position="center" />
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
            </ThemeProvider>
          </TranslationsProvider>
        </Provider>
      </body>
    </html>
  );
}

