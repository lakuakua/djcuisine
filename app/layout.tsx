import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DJ Cuisine - The Best BBQ in H-Town',
  description: 'Premium BBQ catering and plates in Houston. Order big trays, individual plates, and fresh juices for your next event.',
  keywords: 'BBQ, catering, Houston, H-Town, ribs, brisket, pulled pork, catering trays',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
