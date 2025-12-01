import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ekadi - Event Management Platform",
  description: "Create stunning event cards, send invitations via WhatsApp & SMS, and manage RSVPs effortlessly",
  keywords: ["event management", "invitations", "RSVP", "WhatsApp invites", "SMS invites"],
  authors: [{ name: "Ekadi" }],
  openGraph: {
    title: "Ekadi - Event Management Platform",
    description: "Create stunning event cards, send invitations via WhatsApp & SMS, and manage RSVPs effortlessly",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#F9F9F9" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force light mode before React hydrates
                document.documentElement.setAttribute('data-theme', 'light');
                document.documentElement.style.colorScheme = 'light';
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('dark');
                
                // Override CSS variables for light mode
                const root = document.documentElement;
                root.style.setProperty('--color-background', '#ffffff', 'important');
                root.style.setProperty('--color-surface', '#f9fafb', 'important');
                root.style.setProperty('--color-text', '#171717', 'important');
                root.style.setProperty('--color-text-secondary', '#737373', 'important');
                root.style.setProperty('--color-border', '#e5e7eb', 'important');
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}