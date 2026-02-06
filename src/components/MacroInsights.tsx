"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, TrendingUp, TrendingDown, Clock, Info, Banknote, BarChart4, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MacroSummary {
    indicators: {
        [key: string]: {
            value: number;
            change: number;
            label: string;
        }
    };
    fed: {
        forecast: string;
        nextMeeting: string;
        sentiment: string;
    };
    analysis: {
        impact: string;
        correlation: string;
    };
    lastUpdated: string;
}

export function MacroInsights() {
    const { t } = useLanguage();
    const [data, setData] = useState<MacroSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMacro = async () => {
            try {
                const res = await fetch('/api/macro');
                if (!res.ok) throw new Error("API failed");
                const json = await res.json();
                if (json.error) throw new Error(json.error);
                setData(json);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch macro data", err);
                setError("Service Unavailable");
            } finally {
                setLoading(false);
            }
        };

        fetchMacro();
        const interval = setInterval(fetchMacro, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse space-y-4 p-6">
                <div className="h-6 w-1/3 bg-white/5 rounded" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/5 rounded" />
                    <div className="h-20 bg-white/5 rounded" />
                </div>
            </div>
        );
    }

    if (error || !data || !data.fed || !data.indicators) {
        return (
            <div className="p-8 text-center bg-white/5 rounded-xl border border-white/5">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    Macro Data Stream Interrupted ({error || "No Data"})
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-white">
                            {t.macro.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            Next Meeting: {data.fed?.nextMeeting || "TBD"}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase">
                        {data.fed?.sentiment || "Neutral"}
                    </span>
                </div>
            </div>

            {/* Indicator Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.indicators && Object.entries(data.indicators).map(([key, item]) => (
                    <motion.div
                        key={key}
                        whileHover={{ y: -2 }}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all"
                    >
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">
                            {item.label}
                        </p>
                        <div className="flex items-end justify-between">
                            <span className="text-lg font-black text-white tabular-nums tracking-tight">
                                {key === 'sp500' ? item.value.toLocaleString() : `${item.value.toFixed(2)}${key.includes('us') ? '%' : ''}`}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold flex items-center mb-0.5",
                                item.change > 0 ? "text-emerald-400" : "text-rose-400"
                            )}>
                                {item.change > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                {Math.abs(item.change).toFixed(2)}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Macro Analysis Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fed Forecast */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Banknote className="w-12 h-12" />
                    </div>
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BarChart4 className="w-3 h-3" />
                        {t.macro.fed_forecast}
                    </h4>
                    <p className="text-xl font-black text-white mb-1 tracking-tight">
                        {data.fed?.forecast || "Calculating..."}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic mb-4">
                        * Based on CME FedWatch data simulation
                    </p>
                    <motion.a
                        href="https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold hover:bg-indigo-500/20 transition-all"
                    >
                        {t.macro.view_fed_watch}
                        <ArrowUpRight className="w-3 h-3" />
                    </motion.a>
                </div>

                {/* Crypto Impact */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        {t.macro.impact_title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-medium">
                        {data.analysis?.impact || "N/A"}
                    </p>
                    <div className="mt-2 text-[10px] text-amber-400/80 font-bold font-mono">
                        {data.analysis?.correlation || ""}
                    </div>

                    {/* Strategy Note */}
                    <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            Portfolio Strategy
                        </p>
                        <p className="text-[11px] text-gray-400">
                            {data.analysis?.impact?.includes('Positive') || data.analysis?.impact?.includes('Bullish')
                                ? "Favorable macro environment. Consider increasing allocation to risk assets and Altcoins."
                                : "Macro headwinds persist. Prioritize capital preservation and focus on Bitcoin dominance."}
                        </p>
                    </div>
                </div>
            </div>


            {/* Last Updated Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px] text-muted-foreground uppercase tracking-tighter">
                <span>Professional Data Stream • Terminal V1.2</span>
                <span>Last Updated: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
            </div>
        </div>
    );
}
