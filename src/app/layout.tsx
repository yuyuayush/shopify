import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

export const metadata: Metadata = {
  title: 'AURA Storefront — Next.js & Shopify GraphQL Engine',
  description: 'Minimalist luxury storefront built with Next.js 14 App Router, TypeScript, and Shopify Storefront GraphQL API integration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-gray-100 antialiased min-h-screen flex flex-col selection:bg-pink-500 selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
