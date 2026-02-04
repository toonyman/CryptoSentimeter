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
            className="flex flex-col items-center mt-8 touch-none pointer-events-auto"
        >
            <div className="relative group max-w-2xl px-4">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                <div className="relative glass-card bg-black/40 border border-white/5 rounded-2xl p-4 md:p-1 flex flex-col md:flex-row items-center gap-4 transition-all hover:border-white/10 overflow-hidden">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                            Market Today
                        </span>
                    </div>

                    {/* Summary Text */}
                    <p className="text-sm md:text-[13px] text-gray-300 font-medium text-center md:text-left line-clamp-2 md:line-clamp-1 flex-1 leading-relaxed px-2">
                        {outlookDesc}
                    </p>

                    {/* Link */}
                    <Link
                        href="/daily-report"
                        className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all border border-cyan-500/20 group/link shrink-0"
                    >
                        {t.header.report}
                        <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Quick Stats Overlay (Small) */}
            <div className="flex gap-4 mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                <span className="flex items-center gap-1">
                    Index <span className={cn(fngValue > 50 ? "text-emerald-400" : "text-orange-400")}>{fngValue}</span>
                </span>
                <span className="opacity-30">|</span>
                <span className="flex items-center gap-1">
                    BTC <span className={cn(btcChange >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {btcChange >= 0 ? '+' : ''}{btcChange.toFixed(1)}%
                    </span>
                </span>
            </div>
        </motion.div>
    );
}
