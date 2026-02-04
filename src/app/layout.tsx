import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'CryptoSentimeter | Global Insight & Arbitrage Tracker',
  description: 'Buy the Fear, Sell the Greed. Real-time market sentiment and global arbitrage dashboard.',
  keywords: ['Crypto', 'Bitcoin', 'Arbitrage', 'Sentiment', 'Fear and Greed', 'Kimchi Premium'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(outfit.className, "min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden")}>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />
        {children}
      </body>
    </html>
  );
}
