"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Youtube, ExternalLink, User, MessageCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Influencer {
    id: string;
    name: string;
    handle: string;
    platform: 'x' | 'youtube';
    avatar?: string;
    bio: string;
    lastPost?: {
        text: string;
        date: string;
        url: string;
        thumbnail?: string;
    };
    tags: string[];
}

const INFLUENCERS: Influencer[] = [
    {
        id: 'stockmoneyL',
        name: 'Stockmoney Lizard',
        handle: '@StockmoneyL',
        platform: 'x',
        bio: 'Market analyst specializing in BTC cycle analysis and technical breakdowns.',
        tags: ['BTC', 'Cycles', 'TA'],
        lastPost: {
            text: "The bull run structure remains intact. Historical patterns suggest we are in the accumulation phase before the next leg up.",
            date: "2h ago",
            url: "https://x.com/StockmoneyL"
        }
    },
    {
        id: 'egragcrypto',
        name: 'Egrag Crypto',
        handle: '@egragcrypto',
        platform: 'x',
        bio: 'Dedicated XRP analyst known for long-term "moon" targets and geometric chart patterns.',
        tags: ['XRP', 'Moon', 'Geometric'],
        lastPost: {
            text: "XRP is forming a massive symmetrical triangle. If history repeats, the breakout target is legendary.",
            date: "4h ago",
            url: "https://x.com/egragcrypto"
        }
    },
    {
        id: 'jd_crypto',
        name: 'JD',
        handle: '@jaydee_757',
        platform: 'x',
        bio: 'Charts > News. Identifying top crypto picks for the next bull run.',
        tags: ['XRP', 'Charts', 'Alpha'],
        lastPost: {
            text: "Don't get tricked by the noise. The 10-year trendline on XRP is holding firm. Resilience is key.",
            date: "6h ago",
            url: "https://x.com/jaydee_757"
        }
    },
    {
        id: 'tara_crypto',
        name: 'Tara',
        handle: '@_T_A_R_A_',
        platform: 'x',
        bio: 'Focused on the Taraxa ecosystem, DAG technology, and EVM compatibility.',
        tags: ['TARA', 'DAG', 'EVM'],
        lastPost: {
            text: "Taraxa's blockDAG architecture is proving itself every day. Speed and decentralization combined.",
            date: "1d ago",
            url: "https://x.com/_T_A_R_A_"
        }
    },
    {
        id: 'joelkatz',
        name: 'David Schwartz',
        handle: '@JoelKatz',
        platform: 'x',
        bio: 'CTO at Ripple & Architect of the XRP Ledger. Technical insights into XRPL.',
        tags: ['XRPL', 'Tech', 'DeFi'],
        lastPost: {
            text: "The AMM on XRPL is a massive step towards decentralizing liquidity. More features coming soon.",
            date: "8h ago",
            url: "https://x.com/JoelKatz"
        }
    },
    {
        id: 'bgarlinghouse',
        name: 'Brad Garlinghouse',
        handle: '@bgarlinghouse',
        platform: 'x',
        bio: 'CEO of Ripple. Advocating for regulatory clarity and institutional adoption.',
        tags: ['Ripple', 'Legal', 'Adoption'],
        lastPost: {
            text: "Crypto is not going away. We are seeing a massive shift in how the world thinks about value transfer.",
            date: "22h ago",
            url: "https://x.com/bgarlinghouse"
        }
    },
    {
        id: 'stockmoneyYT',
        name: 'Stockmoney Lizard',
        handle: 'Stockmoney Lizard',
        platform: 'youtube',
        bio: 'Weekly Bitcoin updates and major market cycles.',
        tags: ['BTC', 'Cycles', 'Weekly'],
        lastPost: {
            text: "BITCOIN: THE NEXT 3 MONTHS WILL BE INSANE! (Full Analysis)",
            date: "1 day ago",
            url: "https://www.youtube.com/@StockmoneyLizard",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" // Placeholder
        }
    },
    {
        id: 'egragYT',
        name: 'Egrag Crypto',
        handle: 'Egrag Crypto',
        platform: 'youtube',
        bio: 'Deep dives into XRP price action and long-term predictions.',
        tags: ['XRP', 'Analysis', 'Mega'],
        lastPost: {
            text: "XRP: WHY $17 IS CLOSER THAN YOU THINK!",
            date: "2 days ago",
            url: "https://www.youtube.com/@EgragCrypto",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
        }
    }
];

export function InfluencerFeed() {
    const { t } = useLanguage();
    const [activePlatform, setActivePlatform] = useState<'all' | 'x' | 'youtube'>('all');

    const INFLUENCERS: Influencer[] = [
        {
            id: 'vitalik',
            name: 'Vitalik Buterin',
            handle: '@VitalikButerin',
            platform: 'x',
            bio: 'Ethereum co-founder. Focused on decentralization, blockchain tech, and future of crypto.',
            tags: ['ETH', 'Tech', 'DeFi'],
            lastPost: {
                text: "The future of the Ethereum network depends on its ability to scale while maintaining decentralization.",
                date: t.influencer.ago_2h,
                url: "https://x.com/VitalikButerin"
            }
        },
        {
            id: 'cz',
            name: 'CZ Binance',
            handle: '@cz_binance',
            platform: 'x',
            bio: 'Founder and former CEO of Binance. Market trends and global adoption.',
            tags: ['Binance', 'BNB', 'Adoption'],
            lastPost: {
                text: "Stay focused. Build through the cycles. Crypto is just beginning its global journey.",
                date: t.influencer.ago_4h,
                url: "https://x.com/cz_binance"
            }
        },
        {
            id: 'saylor',
            name: 'Michael Saylor',
            handle: '@saylor',
            platform: 'x',
            bio: 'Executive Chairman of MicroStrategy. Major Bitcoin advocate and institutional leader.',
            tags: ['BTC', 'Gold', 'Institutional'],
            lastPost: {
                text: "Bitcoin is digital property. It is the apex predator of the monetary world.",
                date: t.influencer.ago_6h,
                url: "https://x.com/saylor"
            }
        },
        {
            id: 'pomp',
            name: 'Anthony Pompliano',
            handle: '@APompliano',
            platform: 'x',
            bio: 'Investor and host of The Pomp Podcast. Simplifying complex financial trends.',
            tags: ['Finance', 'BTC', 'Venture'],
            lastPost: {
                text: "The institutional wall of money is here. The next cycle will look unlike anything we've seen.",
                date: t.influencer.ago_8h,
                url: "https://x.com/APompliano"
            }
        },
        {
            id: 'elon',
            name: 'Elon Musk',
            handle: '@elonmusk',
            platform: 'x',
            bio: 'Visionary entrepreneur. Occasionally moves markets with specific crypto interests.',
            tags: ['Tech', 'Doge', 'Future'],
            lastPost: {
                text: "Fate loves irony. The most entertaining outcome is often the most likely.",
                date: t.influencer.ago_1d,
                url: "https://x.com/elonmusk"
            }
        },
        {
            id: 'planb',
            name: 'PlanB',
            handle: '@100trillionUSD',
            platform: 'x',
            bio: 'Creator of the Stock-to-Flow model. Data-driven Bitcoin cycle analysis.',
            tags: ['S2F', 'BTC', 'Quant'],
            lastPost: {
                text: "Patience is a virtue in the halvings cycle. The scarcity model is playing out as expected.",
                date: t.influencer.ago_2h,
                url: "https://x.com/100trillionUSD"
            }
        },
        {
            id: 'hayes',
            name: 'Arthur Hayes',
            handle: '@CryptoHayes',
            platform: 'x',
            bio: 'Founder of BitMEX. Macroeconomic analyst focusing on liquidity and market shifts.',
            tags: ['Macro', 'Liquidity', 'Trading'],
            lastPost: {
                text: "Follow the liquidity. When the central banks turn on the taps, assets respond accordingly.",
                date: t.influencer.ago_4h,
                url: "https://x.com/CryptoHayes"
            }
        },
        {
            id: 'jameswynn',
            name: 'James Wynn',
            handle: '@JamesWynnReal',
            platform: 'x',
            bio: 'Strategic investor. Research into XRP, Flare, and tokenized future of finance.',
            tags: ['XRP', 'Flare', 'ISO20022'],
            lastPost: {
                text: "The plumbing of the global financial system is being rewritten. High-utility assets are the winners.",
                date: t.influencer.ago_6h,
                url: "https://x.com/JamesWynnReal"
            }
        },
        {
            id: 'balaji',
            name: 'Balaji Srinivasan',
            handle: '@balajis',
            platform: 'x',
            bio: 'Tech philosopher and former CTO of Coinbase. Expert on the Network State.',
            tags: ['Web3', 'Future', 'Tech'],
            lastPost: {
                text: "Decentralization is more than a trend; it is the fundamental architecture of the new world.",
                date: t.influencer.ago_8h,
                url: "https://x.com/balajis"
            }
        },
        {
            id: 'lark',
            name: 'The Crypto Lark',
            handle: '@TheCryptoLark',
            platform: 'youtube',
            bio: 'Popular YouTuber focused on altcoin gems, portfolio strategy, and market news.',
            tags: ['Altcoins', 'Gems', 'Weekly'],
            lastPost: {
                text: "TOP 5 ALTCOIN GEMS FOR FEBRUARY! (Don't miss these)",
                date: t.influencer.ago_1d,
                url: "https://www.youtube.com/@TheCryptoLark",
                thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
            }
        },
        {
            id: 'precision',
            name: 'Precision Trade',
            handle: '@PrecisionTrade3',
            platform: 'x',
            bio: 'Technical analysis focused on high-precision trade setups and chart patterns.',
            tags: ['Trading', 'Charts', 'Price Action'],
            lastPost: {
                text: "BTC 4H chart shows a clear bull flag. Watching for a breakout confirmation with high volume.",
                date: t.influencer.ago_2h,
                url: "https://x.com/PrecisionTrade3"
            }
        },
        {
            id: 'casi',
            name: 'Casi Trades',
            handle: '@CasiTrades',
            platform: 'x',
            bio: 'Analytical views on market sentiment and high-cap token performance.',
            tags: ['Alpha', 'Sentiment', 'TA'],
            lastPost: {
                text: "Sentiment is shifting from fear to neutral. This is typically where the smartest entries happen.",
                date: t.influencer.ago_4h,
                url: "https://x.com/CasiTrades"
            }
        },
        {
            id: 'egrag',
            name: 'Egrag Crypto',
            handle: '@egragcrypto',
            platform: 'x',
            bio: 'Geometric chart patterns and long-term targets for XRP and other majors.',
            tags: ['XRP', 'Geometric', 'Moon'],
            lastPost: {
                text: "The 'White Channel' on XRP is still the key. We are following the path to legendary gains.",
                date: t.influencer.ago_6h,
                url: "https://x.com/egragcrypto"
            }
        },
        {
            id: 'stockmoney',
            name: 'Stockmoney Lizard',
            handle: '@StockmoneyL',
            platform: 'x',
            bio: 'BTC Cycle analysis and macro technical structure expert.',
            tags: ['BTC', 'Cycles', 'Macro'],
            lastPost: {
                text: "Historical data confirms we are in phase 2 of the bull cycle. Don't let the noise shake you.",
                date: t.influencer.ago_8h,
                url: "https://x.com/StockmoneyL"
            }
        }
    ];

    const filteredInfluencers = INFLUENCERS.filter(inf =>
        activePlatform === 'all' || inf.platform === activePlatform
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                        {activePlatform === 'all' ? t.influencer.title : activePlatform === 'x' ? 'X (Twitter) Feed' : 'YouTube Insights'}
                    </h2>
                    <p className="text-muted-foreground">{t.influencer.subtitle}</p>
                </div>

                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
                    <button
                        onClick={() => setActivePlatform('all')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            activePlatform === 'all' ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        {t.influencer.all}
                    </button>
                    <button
                        onClick={() => setActivePlatform('x')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                            activePlatform === 'x' ? "bg-blue-500/20 text-blue-400 shadow-lg" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Twitter className="w-4 h-4" />
                        X (Twitter)
                    </button>
                    <button
                        onClick={() => setActivePlatform('youtube')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                            activePlatform === 'youtube' ? "bg-red-500/20 text-red-400 shadow-lg" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Youtube className="w-4 h-4" />
                        YouTube
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredInfluencers.map((inf) => (
                        <motion.div
                            key={inf.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="glass-card group flex flex-col hover:border-white/20 transition-all border-white/5 relative overflow-hidden"
                        >
                            <a
                                href={inf.lastPost?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 z-0"
                                aria-label="View Link"
                            />

                            {/* Compact Header */}
                            <div className="p-4 flex items-center justify-between pb-2 relative z-10">
                                <div className="flex items-center gap-2.5">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center border border-white/10 shadow-inner",
                                        inf.platform === 'x' ? "bg-blue-500/10" : "bg-red-500/10"
                                    )}>
                                        {inf.platform === 'x' ? <Twitter className="w-4 h-4 text-blue-400" /> : <Youtube className="w-4 h-4 text-red-400" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-sm text-gray-200 group-hover:text-cyan-400 transition-colors leading-none mb-1">
                                            <a href={inf.lastPost?.url} target="_blank" rel="noopener noreferrer" className="hover:underline focus:outline-none">
                                                {inf.name}
                                            </a>
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground font-medium">{inf.handle}</p>
                                    </div>
                                </div>
                                <a
                                    href={inf.lastPost?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-muted-foreground hover:text-white transition-all border border-transparent hover:border-white/5"
                                >
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block text-[10px]">View</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>

                            {/* Content Snippet */}
                            <div className="px-4 pb-2 relative z-10 flex-1">
                                {inf.lastPost && (
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 rounded-full" />
                                        <p className="pl-3 text-xs text-gray-400 leading-relaxed line-clamp-3 hover:text-gray-300 transition-colors">
                                            {inf.lastPost.text}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer (Tags & Time) */}
                            <div className="p-3 px-4 mt-auto flex items-center justify-between border-t border-white/5 bg-white/[0.02] relative z-10">
                                <div className="flex gap-1.5">
                                    {inf.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[9px] font-bold text-muted-foreground/70 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[10px] font-medium text-white/30 group-hover:text-white/50 transition-colors">
                                    {inf.lastPost?.date}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
