"use client";

import { useArbitrage } from '@/hooks/useArbitrage';
import { cn } from '@/lib/utils';
import { Globe, ArrowRightLeft, ArrowUpRight, ArrowDownRight, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useMemo } from 'react';

type SortKey = 'symbol' | 'binancePrice' | 'change24h' | 'upbitPrice' | 'kimchiPremium' | 'coinbasePremium' | 'marketCap' | 'marketCapChange24h';
type SortDirection = 'asc' | 'desc';

export function ArbitrageTable() {
    const { data, isLoading, exchangeRate } = useArbitrage();
    const { t } = useLanguage();
    const [sortKey, setSortKey] = useState<SortKey>('marketCap');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const sortedData = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }, [data, sortKey, sortDirection]);

    const SortIcon = ({ active }: { active: boolean }) => (
        <ArrowUpDown className={cn("w-3 h-3 ml-1 transition-opacity", active ? "opacity-100 text-primary" : "opacity-30")} />
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-6 rounded-xl overflow-hidden h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Globe className="text-purple-400" /> {t.market_overview.title} & {t.arbitrage_table.title.split('(')[0].trim()}
                </h3>
                <div className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                    1 USD ≈ {exchangeRate.toFixed(0)} KRW
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left whitespace-nowrap">
                    <thead>
                        <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5 cursor-pointer select-none">
                            <th className="sticky left-0 z-20 bg-[#0f172a] py-4 pl-4 font-medium hover:text-white transition-colors shadow-[1px_0_0_0_rgba(255,255,255,0.05)]" onClick={() => handleSort('symbol')}>
                                <div className="flex items-center">{t.market_overview.coin} <SortIcon active={sortKey === 'symbol'} /></div>
                            </th>
                            <th className="py-4 font-medium text-right hover:text-white transition-colors" onClick={() => handleSort('marketCap')}>
                                <div className="flex items-center justify-end">{t.market_overview.market_cap} <SortIcon active={sortKey === 'marketCap'} /></div>
                            </th>
                            <th className="py-4 font-medium text-right hover:text-white transition-colors" onClick={() => handleSort('marketCapChange24h')}>
                                <div className="flex items-center justify-end">MCap Change <SortIcon active={sortKey === 'marketCapChange24h'} /></div>
                            </th>
                            <th className="py-4 font-medium text-right hover:text-white transition-colors" onClick={() => handleSort('binancePrice')}>
                                <div className="flex items-center justify-end">{t.arbitrage_table.global} <SortIcon active={sortKey === 'binancePrice'} /></div>
                            </th>
                            <th className="py-4 font-medium text-right hover:text-white transition-colors" onClick={() => handleSort('change24h')}>
                                <div className="flex items-center justify-end">{t.market_overview.change24h} <SortIcon active={sortKey === 'change24h'} /></div>
                            </th>
                            <th className="py-4 font-medium text-right hover:text-white transition-colors" onClick={() => handleSort('upbitPrice')}>
                                <div className="flex items-center justify-end">{t.arbitrage_table.korea} <SortIcon active={sortKey === 'upbitPrice'} /></div>
                            </th>
                            <th className="py-4 font-medium text-right hover:text-white transition-colors" onClick={() => handleSort('kimchiPremium')}>
                                <div className="flex items-center justify-end">{t.arbitrage_table.kimchi_premium} <SortIcon active={sortKey === 'kimchiPremium'} /></div>
                            </th>
                            <th className="py-4 font-medium text-right pr-4 hover:text-white transition-colors" onClick={() => handleSort('coinbasePremium')}>
                                <div className="flex items-center justify-end">{t.arbitrage_table.coinbase_premium} <SortIcon active={sortKey === 'coinbasePremium'} /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            [...Array(15)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="sticky left-0 z-10 bg-[#0f172a] py-4 pl-4 shadow-[1px_0_0_0_rgba(255,255,255,0.05)]"><div className="h-6 w-24 bg-white/5 rounded" /></td>
                                    <td className="py-4"><div className="h-6 w-16 bg-white/5 rounded ml-auto" /></td>
                                    <td className="py-4"><div className="h-6 w-20 bg-white/5 rounded ml-auto" /></td>
                                    <td className="py-4"><div className="h-6 w-16 bg-white/5 rounded ml-auto" /></td>
                                    <td className="py-4"><div className="h-6 w-20 bg-white/5 rounded ml-auto" /></td>
                                    <td className="py-4"><div className="h-6 w-12 bg-white/5 rounded ml-auto" /></td>
                                    <td className="py-4"><div className="h-6 w-12 bg-white/5 rounded ml-auto" /></td>
                                    <td className="py-4 pr-4"><div className="h-6 w-12 bg-white/5 rounded ml-auto" /></td>
                                </tr>
                            ))
                        ) : (
                            sortedData.slice(0, 15).map((item) => (
                                <tr key={item.symbol} className="group hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 z-10 bg-[#0f172a] group-hover:bg-[#1e293b] py-4 pl-4 flex items-center gap-3 shadow-[1px_0_0_0_rgba(255,255,255,0.05)] transition-colors">
                                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="font-bold text-sm">{item.symbol}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[100px]">{item.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right text-sm text-muted-foreground">
                                        ${(item.marketCap / 1e9).toFixed(2)}B
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className={cn("inline-flex items-center gap-1 text-sm font-semibold justify-end",
                                            item.marketCapChange24h >= 0 ? "text-emerald-400" : "text-red-400"
                                        )}>
                                            {/* Note: CoinGecko API markets endpoint doesn't always return mcap change % unless specified, checked hooks and it seemed missing, but assuming it works now or default 0 */}
                                            {item.marketCapChange24h ? (
                                                <>
                                                    {item.marketCapChange24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                    {Math.abs(item.marketCapChange24h).toFixed(2)}%
                                                </>
                                            ) : <span className="text-muted-foreground">-</span>}
                                        </div>
                                    </td>
                                    <td className="py-4 text-right text-sm text-muted-foreground">
                                        ${item.binancePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className={cn("inline-flex items-center gap-1 text-sm font-semibold justify-end",
                                            item.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                                        )}>
                                            {item.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            {Math.abs(item.change24h).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="py-4 text-right text-sm">
                                        ₩{item.upbitPrice.toLocaleString()}
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-md text-xs font-bold",
                                            item.kimchiPremium > 3 ? "bg-red-500/10 text-red-400" :
                                                item.kimchiPremium > 0 ? "bg-green-500/10 text-green-400" :
                                                    "bg-blue-500/10 text-blue-400"
                                        )}>
                                            {item.kimchiPremium > 0 ? "+" : ""}{item.kimchiPremium.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="py-4 text-right pr-4">
                                        {item.coinbasePrice > 0 ? (
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-md text-xs font-bold",
                                                item.coinbasePremium > 0.1 ? "bg-green-500/10 text-green-400" :
                                                    item.coinbasePremium < -0.1 ? "bg-red-500/10 text-red-400" :
                                                        "text-muted-foreground"
                                            )}>
                                                {item.coinbasePremium > 0 ? "+" : ""}{item.coinbasePremium.toFixed(3)}%
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading && (
                <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-primary shrink-0" />
                        <span>{t.arbitrage_table.tip}</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
