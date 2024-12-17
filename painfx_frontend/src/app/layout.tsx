import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Provider from '@/redux/provider';
import Setup from "@/lib/Setup";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ReactQueryProvider } from "@/components/providers/provider";
import 'leaflet/dist/leaflet.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'PainFX',
  description: 'Verify the authenticity of the videos',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.png",
        href: "/logo.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "./logo.png",
        href: "/logo.png",
      }
    ]
  }
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
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="qstit-theme"
          >
          <Setup />
          <ModalProvider />
          <Toaster position="bottom-center" />
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
       </ThemeProvider>
    </Provider>
    </body>
</html>
  );
}
