"use client";

import React, { useMemo } from 'react';
import { useGlobalMarket, useCryptoPrices } from '@/hooks/useCryptoData';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Info, Activity, Bitcoin, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DominancePhase() {
    const { t } = useLanguage();
    const { data: globalData, isLoading: globalLoading } = useGlobalMarket();
    const { coins, isLoading: coinsLoading } = useCryptoPrices();

    const analysis = useMemo(() => {
        if (!globalData || !coins) return null;

        const btcDominance = globalData.market_cap_percentage.btc;
        const btcData = coins.find(c => c.symbol.toLowerCase() === 'btc');
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
    }, [globalData, coins, t]);

    if (globalLoading || coinsLoading) {
        return (
            <div className="animate-pulse space-y-4 p-4">
                <div className="h-4 w-1/2 bg-white/5 rounded" />
                <div className="h-10 w-full bg-white/5 rounded" />
                <div className="h-20 w-full bg-white/5 rounded" />
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg bg-opacity-20", analysis.colorClass.replace('text', 'bg'))}>
                        {analysis.icon}
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {t.dominance.title}
                    </h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-white">{analysis.btcDominance.toFixed(1)}%</span>
                </div>
            </div>

            {/* Main Display */}
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-3 mb-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn("text-2xl font-black tracking-tight leading-tight", analysis.colorClass)}
                >
                    {analysis.phase}
                </motion.div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 px-[1px]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.btcDominance}%` }}
                        className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]", analysis.colorClass.replace('text', 'bg'))}
                    />
                </div>
                <div className="flex justify-between w-full text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">
                    <span>{t.dominance.alt_heavy}</span>
                    <span>{t.dominance.neutral}</span>
                    <span>{t.dominance.btc_heavy}</span>
                </div>
            </div>

            {/* AI Analysis Card */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 opacity-50" />
                <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                            {analysis.description}
                        </p>
                        <p className="text-[10px] text-cyan-400/80 mt-2 font-bold italic">
                            💡 {analysis.suggestion}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
