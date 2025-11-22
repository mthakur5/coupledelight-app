import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import CartProvider from "@/components/providers/CartProvider";
import CartPopupWrapper from "@/components/CartPopupWrapper";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoupleDelight - Connect, Share, Celebrate",
  description: "Your digital space to create memories, plan events, and share wishlists",
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "CoupleDelight - Connect, Share, Celebrate",
    description: "Your digital space to create memories, plan events, and share wishlists",
    images: ['/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            <Navbar />
            {children}
            <CartPopupWrapper />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
