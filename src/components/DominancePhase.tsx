"use client";

import React, { useMemo } from 'react';
import { useGlobalMarket } from '@/hooks/useCryptoData';
import { useMarketData, ArbitrageItem } from '@/hooks/useMarketData';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Info, Activity, Bitcoin, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DominancePhase() {
    const { t } = useLanguage();
    const { data: globalData, isLoading: globalLoading } = useGlobalMarket();
    const { data: marketData, isLoading: marketLoading } = useMarketData();

    const analysis = useMemo(() => {
        const coins = marketData?.items;
        if (!globalData || !coins) return null;

        const btcDominance = globalData.market_cap_percentage.btc;
        const btcData = coins.find((c: ArbitrageItem) => c.symbol.toLowerCase() === 'btc');
        const btcPriceChange = btcData?.price_change_percentage_24h || 0;

        // Determination Logic
        let phase = "";
        let description = "";
        let colorClass = "";
        let icon = null;
        let suggestion = "";

        if (btcDominance > 55) {
            if (btcPriceChange > 0) {
                phase = t.dominance.phase_btc_lead;
                description = t.dominance.desc_btc_lead;
                colorClass = "text-orange-400";
                icon = <Bitcoin className="w-5 h-5" />;
                suggestion = t.dominance.sug_btc_lead;
            } else {
                phase = t.dominance.phase_btc_safe;
                description = t.dominance.desc_btc_safe;
                colorClass = "text-amber-500";
                icon = <Activity className="w-5 h-5" />;
                suggestion = t.dominance.sug_btc_safe;
            }
        } else if (btcDominance < 45) {
            if (btcPriceChange > 0) {
                phase = t.dominance.phase_alt_season;
                description = t.dominance.desc_alt_season;
                colorClass = "text-emerald-400";
                icon = <Coins className="w-5 h-5" />;
                suggestion = t.dominance.sug_alt_season;
            } else {
                phase = t.dominance.phase_market_rebound;
                description = t.dominance.desc_market_rebound;
                colorClass = "text-cyan-400";
                icon = <TrendingUp className="w-5 h-5" />;
                suggestion = t.dominance.sug_market_rebound;
            }
        } else {
            phase = t.dominance.phase_neutral;
            description = t.dominance.desc_neutral;
            colorClass = "text-blue-400";
            icon = <Activity className="w-5 h-5" />;
            suggestion = t.dominance.sug_neutral;
        }

        return { btcDominance, phase, description, colorClass, icon, suggestion, btcPriceChange };
    }, [globalData, marketData, t]);

    if (globalLoading || marketLoading) {
        return (
            <div className="animate-pulse space-y-4 p-4">
                <div className="h-4 w-1/2 bg-white/5 rounded" />
                <div className="h-10 w-full bg-white/5 rounded" />
                <div className="h-20 w-full bg-white/5 rounded" />
            </div>
        );
    }

    if (!analysis) return null;

    const altDominance = 100 - analysis.btcDominance;

    return (
        <div className="flex flex-col h-full justify-center">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {t.dominance.title}
                    </h3>
                </div>
            </div>

            {/* Market Phase Signal (Weather/Traffic Light) */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                <div className={cn("p-2 rounded-lg bg-opacity-20 flex items-center justify-center shadow-inner", analysis.colorClass.replace('text', 'bg'))}>
                    {analysis.icon}
                </div>
                <div className="flex flex-col">
                    <span className={cn("text-xs font-black uppercase tracking-widest", analysis.colorClass)}>
                        {analysis.phase}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">
                        {analysis.suggestion}
                    </span>
                </div>
            </div>

            {/* Dominance Bars */}
            <div className="space-y-6">
                {/* Bitcoin Index */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-300">
                        <span>{t.dominance.btc_index}</span>
                        <span>{analysis.btcDominance.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.btcDominance}%` }}
                            className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                        />
                    </div>
                </div>

                {/* Altcoin Index */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-300">
                        <span>{t.dominance.alt_index}</span>
                        <span>{altDominance.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${altDominance}%` }}
                            className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
