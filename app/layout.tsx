import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
      <body className={`${inter.className} bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
