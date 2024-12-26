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
  metadataBase: new URL('https://painfx.com'),
  title: {
    default: 'PainFX | Community for Medical Professionals',
    template: '%s | PainFX'
  },
  description: 'PainFX is the premier community platform for Doctors, Hospitals, and Clinics specializing in pain management and treatment.',
  keywords: ['PainFX', 'medical community', 'doctors', 'hospitals', 'clinics', 'pain management'],
  authors: [{ name: 'Supernova Team' }],
  creator: 'PainFX',
  publisher: 'Supernova Inc.',
  // openGraph: {
  //   type: 'website',
  //   locale: 'en_US',
  //   url: 'https://painfx.com',
  //   siteName: 'PainFX',
  //   title: 'PainFX | Community for Medical Professionals',
  //   description: 'Connect with leading pain management specialists, hospitals, and clinics on PainFX.',
  //   images: [
  //     {
  //       url: '/assets/favicon-16x16.png',
  //       width: 1200,
  //       height: 630,
  //       alt: 'PainFX - Medical Professional Community'
  //     }
  //   ]
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   site: '@PainFX',
  //   creator: '@PainFX',
  //   title: 'PainFX | Community for Medical Professionals',
  //   description: 'Connect with leading pain management specialists, hospitals, and clinics on PainFX.',
  //   images: ['https://painfx.com/twitter-image.jpg'],
  // },
  // icons: {
  //   icon: [
  //     { url: '/assets/favicon.ico', sizes: '32x32' },
  //     { url: '/assets/logo.svg', type: 'image/svg+xml' },
  //     { url: '/assets/apple-icon.png', sizes: '180x180', type: 'image/png' },
  //   ],
  //   apple: [
  //     { url: '/assets/apple-icon.png', sizes: '180x180', type: 'image/png' },
  //   ],
  //   other: [
  //     {
  //       rel: 'mask-icon',
  //       url: '/assets/safari-pinned-tab.svg',
  //     },
  //   ],
  // },
  // manifest: '/site.webmanifest',
  // applicationName: 'PainFX',
  // category: 'Medical',
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  //   { media: '(prefers-color-scheme: dark)', color: '#000000' },
  // ],
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
            <Toaster position="bottom-center" />
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

