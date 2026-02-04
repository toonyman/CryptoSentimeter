import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'CryptoSentimeter | Global Crypto Sentiment & Premium Tracker',
  description: 'Buy the Fear, Sell the Greed. Real-time market sentiment analysis, Kimchi Premium, and Coinbase Premium tracker for smart crypto investors.',
  keywords: ['Crypto', 'Bitcoin', 'Arbitrage', 'Sentiment', 'Fear and Greed Index', 'Kimchi Premium', 'Coinbase Premium', 'Upbit', 'Binance'],
  authors: [{ name: 'CryptoSentimeter Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',

  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    url: 'https://crypto-sentimeter.vercel.app',
    title: 'CryptoSentimeter | Global Crypto Sentiment & Premium Tracker',
    description: 'Track real-time market sentiment and global price differences (Kimchi & Coinbase Premium).',
    siteName: 'CryptoSentimeter',
    images: [
      {
        url: 'https://crypto-sentimeter.vercel.app/og-image.png', // Updated Vercel domain
        width: 1200,
        height: 630,
        alt: 'CryptoSentimeter Dashboard',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoSentimeter | Global Crypto Sentiment Tracker',
    description: 'Buy the Fear, Sell the Greed. Real-time arbitrage and sentiment analysis.',
    images: ['https://crypto-sentimeter.vercel.app/og-image.png'],
  },

  // Google Search Console Verification
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // User should replace this
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

  return (
    <html lang="ko" className="dark">
      <body className={cn(outfit.className, "min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden")}>
        {GA_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10" />
        {children}
      </body>
    </html>
  );
}
