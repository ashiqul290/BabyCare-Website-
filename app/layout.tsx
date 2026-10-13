import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'BabyCare E-Commerce Store - Baby Products Online in Bangladesh',
  description:
    'Complete, production-ready baby products e-commerce store with rich catalog, cart, checkout, customer accounts, and administrative dashboard.',
  openGraph: {
    title: 'BabyCare E-Commerce Store',
    description:
      'Online baby shop in Bangladesh for authentic diapers, milk formulas, feeding bottles, school essentials, toys, and grooming care products.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BabyCare E-Commerce Store',
    description:
      'Online baby shop in Bangladesh for authentic diapers, milk formulas, feeding bottles, school essentials, toys, and grooming care products.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-white text-slate-800 antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
