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
  icons: {
    icon: "/favicon.svg",
  },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#008080" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}