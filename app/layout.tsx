import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import FacebookPixel from '@/components/FacebookPixel';
import './globals.css';

const facebookPixelId =
  process.env.FACEBOOK_PIXEL?.trim() ||
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim();

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DJCUISINE - The Best BBQ in H-Town',
  description: 'Premium BBQ catering and plates in Houston. Order big trays, individual plates, and fresh juices for your next event.',
  keywords: 'DJCUISINE, BBQ, catering, Houston, H-Town, ribs, brisket, pulled pork, catering trays',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white antialiased`}>
        {facebookPixelId ? <FacebookPixel pixelId={facebookPixelId} /> : null}
        {children}
      </body>
    </html>
  );
}
// v1774999715
