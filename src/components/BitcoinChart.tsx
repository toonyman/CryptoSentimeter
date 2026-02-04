"use client";

import { useBitcoinChart, useCryptoPrices, useFearAndGreed } from '@/hooks/useCryptoData';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export function BitcoinChart() {
    const { chartData, isLoading: chartLoading } = useBitcoinChart();
    const { coins, isLoading: coinsLoading } = useCryptoPrices();
    const { history: fngHistory, isLoading: fngLoading } = useFearAndGreed();
    const { t } = useLanguage();

    const bitcoin = coins?.find(c => c.id === 'bitcoin');
    const isLoading = chartLoading || coinsLoading;

    if (isLoading) {
        return (
            <div className="h-[250px] w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Loading Chart...</span>
            </div>
        );
    }

    if (!chartData || !chartData.prices) {
        return <div className="h-[250px] w-full flex items-center justify-center text-xs text-muted-foreground">Chart Unavailable</div>;
    }

    const data = chartData.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        // Find matching F&G value for this day
        // F&G timestamp is mostly midnight UTC. We match by day.
        const fngItem = fngHistory?.find(item => isSameDay(new Date(parseInt(item.timestamp) * 1000), date));

        return {
            date,
            price: price.toFixed(0),
            fng: fngItem ? parseInt(fngItem.value) : null
        };
    });

    const minPrice = Math.min(...data.map(d => parseFloat(d.price)));
    const maxPrice = Math.max(...data.map(d => parseFloat(d.price)));
    const domainTrigger = [(minPrice * 0.98), (maxPrice * 1.02)];

    return (
        <div className="w-full h-[350px] mt-4 px-4 md:px-0">
            <div className="flex flex-col items-center mb-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{t.chart.title}</span>
                {bitcoin && (
                    <div className="flex items-center gap-3 animate-fade-in-up">
                        <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            ${bitcoin.current_price.toLocaleString()}
                        </span>
                        <div className={cn(
                            "flex items-center gap-0.5 px-2 py-1 rounded-lg text-sm font-bold",
                            bitcoin.price_change_percentage_24h >= 0
                                ? "bg-green-500/10 text-green-400"
                                : "bg-red-500/10 text-red-400"
                        )}>
                            {bitcoin.price_change_percentage_24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(bitcoin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => format(date, 'MM/dd')}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            yAxisId="left"
                            domain={domainTrigger as any}
                            hide={true}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 100]}
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                            labelFormatter={(date) => format(date, 'MMM dd, HH:mm')}
                            formatter={(value: any, name: any) => {
                                if (name === 'Bitcoin Price') return [`$${parseInt(value).toLocaleString()}`, 'Price'];
                                if (name === 'Fear & Greed') return [value, 'Fear & Greed'];
                                return [value, name];
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="price"
                            name="Bitcoin Price"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                        <Line
                            yAxisId="right"
                            type="stepAfter"
                            dataKey="fng"
                            name="Fear & Greed"
                            stroke="#f97316"
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
