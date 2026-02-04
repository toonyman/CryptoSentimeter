"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DailyMarketBriefProps {
    fngValue: number;
    btcChange: number;
    outlookDesc: string;
}

export function DailyMarketBrief({ fngValue, btcChange, outlookDesc }: DailyMarketBriefProps) {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center mt-12 mb-8 w-full max-w-4xl mx-auto px-4"
        >
            <div className="relative group w-full">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                <div className="relative glass-card bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-6 text-center transition-all hover:border-white/10 overflow-hidden">

                    {/* Header Badge */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2">
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                            Today's Market Report
                        </span>
                    </div>

                    {/* Summary Text - Key Emphasized Content */}
                    <p className="text-xl md:text-3xl text-white font-bold leading-tight md:leading-snug max-w-3xl drop-shadow-sm">
                        "{outlookDesc}"
                    </p>

                    {/* Action Area */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-black/30 px-4 py-2 rounded-lg border border-white/5">
                            <span className="flex items-center gap-2">
                                F&G Index <span className={cn("text-base", fngValue > 50 ? "text-emerald-400" : "text-orange-400")}>{fngValue}</span>
                            </span>
                            <span className="w-px h-4 bg-white/10" />
                            <span className="flex items-center gap-2">
                                BTC <span className={cn("text-base", btcChange >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                    {btcChange >= 0 ? '+' : ''}{btcChange.toFixed(1)}%
                                </span>
                            </span>
                        </div>

                        <Link
                            href="/daily-report"
                            className="flex items-center gap-2 py-2 px-6 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] group/btn"
                        >
                            {t.header.report}
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
