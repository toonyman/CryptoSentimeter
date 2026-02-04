"use client";

import { Activity, ArrowUpRight, BarChart3, PieChart } from 'lucide-react';
import Link from 'next/link';
import { useFearAndGreed, useGlobalMarket } from '@/hooks/useCryptoData';
import { ArbitrageTable } from '@/components/ArbitrageTable';
import { NewsFeed } from '@/components/NewsFeed';
import { InfluencerFeed } from '@/components/InfluencerFeed';
import { BitcoinChart } from '@/components/BitcoinChart';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ShareMenu } from '@/components/ShareMenu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { MobileMenu } from '@/components/MobileMenu';

function Dashboard() {
  const { t } = useLanguage();
  const { data: fng, history: fngHistory, isLoading: fngLoading } = useFearAndGreed();
  const { data: globalData, isLoading: globalLoading } = useGlobalMarket();

  const getFngColor = (value: number) => {
    if (value >= 75) return "text-green-500";
    if (value >= 50) return "text-emerald-400";
    if (value >= 25) return "text-orange-400";
    return "text-red-500";
  };

  const fngValue = fng ? parseInt(fng.value) : 50;
  const fngColor = getFngColor(fngValue);

  // Prepare Sparkline data (reverse to chronological)
  const fngSparkData = fngHistory ? [...fngHistory].reverse().map(item => ({ value: parseInt(item.value) })) : [];

  return (
    <main id="dashboard" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-between py-2 mobile-safe-width border-b border-white/5 mb-4 -mx-4 px-4 sm:px-6 lg:px-8 lg:-mx-8 lg:px-8 xl:rounded-b-2xl xl:mx-auto xl:max-w-7xl decoration-clone relative">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
            CryptoSentimeter
          </span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground mr-2">
            <Link href="#dashboard" className="hover:text-primary transition-colors">{t.header.dashboard}</Link>
            <Link href="#arbitrage" className="hover:text-primary transition-colors">{t.header.arbitrage}</Link>
            <Link href="#news" className="hover:text-primary transition-colors">{t.header.news}</Link>
            <Link href="#influencers" className="hover:text-primary transition-colors">{t.influencer.title}</Link>
            <Link href="/daily-report" className="hover:text-primary transition-colors">{t.header.report}</Link>
          </nav>
          <LanguageToggle />
          <ShareMenu />
          <MobileMenu />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-center py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto px-4"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            {t.hero.live_data}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-400">
              {t.hero.title1}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mt-2">
              {t.hero.title2}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Dashboard Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(350px,auto)]">

        {/* Bitcoin Chart (Row 1) */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2 flex flex-col justify-center">
          <BitcoinChart />
        </div>

        {/* Fear & Greed Card (Row 1) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-0 rounded-3xl lg:col-span-1 flex flex-col relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

          {/* Top Half: Fear & Greed */}
          <div className="p-8 pb-4 flex flex-col items-center justify-center text-center border-b border-white/5">
            <h3 className="text-xl font-medium text-muted-foreground mb-4">{t.fng.title}</h3>

            {fngLoading ? (
              <div className="animate-pulse flex flex-col items-center gap-4 w-full">
                <div className="h-24 w-24 rounded-full bg-white/5" />
              </div>
            ) : (
              <>
                <div className="relative mb-2 flex items-end justify-center">
                  {/* SVG Gauge */}
                  <div className="w-32 h-16 relative overflow-hidden">
                    <svg className="w-32 h-16 overflow-visible" viewBox="0 0 100 50">
                      <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                      <motion.path
                        d="M10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke={fngValue >= 50 ? "#10b981" : "#f97316"}
                        strokeWidth={10}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: fngValue / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute bottom-0 w-full text-center">
                      <span className="text-2xl font-bold text-white">{fngValue}</span>
                    </div>
                  </div>
                </div>
                <span className={cn("text-lg font-bold tracking-wider uppercase", fngColor)}>
                  {fng?.classification}
                </span>

                {/* F&G Sparkline */}
                <div className="w-full h-[60px] mt-2 px-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fngSparkData}>
                      <YAxis domain={[0, 100]} hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={fngValue >= 50 ? "#10b981" : "#f97316"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">7 Day Trend</p>
              </>
            )}
          </div>

          {/* Bottom Half: Market Indexes (Dominance) */}
          <div className="p-6 grid grid-cols-2 gap-4 bg-black/10 flex-1">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 z-10">
                <div className="p-1.5 rounded-full bg-orange-500/20 text-orange-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t.dominance.btc_index}</span>
              </div>
              {globalLoading ? (
                <div className="h-6 w-12 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className="text-center z-10">
                  <span className="text-lg font-bold text-white">
                    {globalData?.market_cap_percentage?.btc.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 z-10">
                <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-400">
                  <PieChart className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t.dominance.alt_index}</span>
              </div>
              {globalLoading ? (
                <div className="h-6 w-12 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className="text-center z-10">
                  <span className="text-lg font-bold text-white">
                    {globalData?.market_cap_percentage?.eth.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* New External Link Button */}
          <div className="px-6 pb-6 bg-black/10">
            <a
              href="https://coinmarketcap.com/charts/fear-and-greed-index/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-white transition-all group"
            >
              {t.fng.cmc_link_text}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Arbitrage Table (Row 2, Full Width) */}
        <div id="arbitrage" className="lg:col-span-3 h-full">
          <ArbitrageTable />
        </div>

        {/* News Feed (Row 3, Full Width) */}
        <div id="news" className="lg:col-span-3 h-full min-h-[500px]">
          <NewsFeed />
        </div>

        {/* Influencer Feed (Row 4, Full Width) */}
        <div id="influencers" className="lg:col-span-3 h-full pt-10 border-t border-white/5">
          <InfluencerFeed />
        </div>

      </section>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
}
