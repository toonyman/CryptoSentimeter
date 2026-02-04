"use client";

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, RefreshCw, BarChart3, Calendar, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Article {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: { name: string };
    sentiment?: 'positive' | 'negative' | 'neutral';
}

interface VibeData {
    keyword: string;
    vibeScore: number;
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    positivePercent: number;
    negativePercent: number;
    neutralPercent: number;
    articles: Article[];
    trendData: { date: string; score: number }[];
    timestamp: string;
}

export function VibeChecker() {
    const { t, language } = useLanguage();
    const [keyword, setKeyword] = useState('Bitcoin');
    const [loading, setLoading] = useState(false);
    const [vibeData, setVibeData] = useState<VibeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showArticles, setShowArticles] = useState(false);

    // Analysis logic remains same ...
    const performSentimentAnalysis = (articles: any[], term: string) => {
        const positiveWords: Record<string, string[]> = {
            en: ['breakthrough', 'success', 'growth', 'innovation', 'celebrates', 'milestone', 'positive', 'rises', 'gains', 'soars', 'wins', 'surges', 'profit', 'record', 'best'],
            ko: ['상승', '급등', '호재', '성공', '성장', '혁신', '최고', '기대', '강세', '돌파', '이익', '기록', '최대', '확대', '유망']
        };
        const negativeWords: Record<string, string[]> = {
            en: ['concerns', 'challenges', 'struggles', 'falls', 'drops', 'crisis', 'fails', 'loss', 'decline', 'hurdles', 'volatility', 'crash', 'worst', 'plunges', 'risks'],
            ko: ['하락', '급락', '우려', '실패', '감소', '위기', '손실', '악재', '약세', '부진', '충격', '폭락', '최저', '축소', '위험']
        };
        // ... (rest of logic from original line 53-110)
        const posList = positiveWords[language] || positiveWords['en'];
        const negList = negativeWords[language] || negativeWords['en'];

        let positive = 0, negative = 0, neutral = 0;
        const analyzedArticles: Article[] = [];

        articles.forEach(article => {
            const text = `${article.title} ${article.description || ''}`.toLowerCase();
            const posScore = posList.filter(w => text.includes(w)).length;
            const negScore = negList.filter(w => text.includes(w)).length;

            let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
            if (posScore > negScore) sentiment = 'positive';
            else if (negScore > posScore) sentiment = 'negative';

            if (sentiment === 'positive') positive++;
            else if (sentiment === 'negative') negative++;
            else neutral++;

            analyzedArticles.push({ ...article, sentiment });
        });

        const total = articles.length;
        const vibeScore = total > 0 ? Math.round(((positive - negative) / total) * 50 + 50) : 50;

        const trendMap: Record<string, { date: string; pos: number; neg: number; count: number }> = {};
        analyzedArticles.forEach(article => {
            if (!article.publishedAt) return;
            const date = article.publishedAt.split('T')[0];
            if (!trendMap[date]) trendMap[date] = { date, pos: 0, neg: 0, count: 0 };
            if (article.sentiment === 'positive') trendMap[date].pos++;
            else if (article.sentiment === 'negative') trendMap[date].neg++;
            trendMap[date].count++;
        });

        const trendData = Object.values(trendMap)
            .map(d => ({
                date: d.date,
                score: Math.round(((d.pos - d.neg) / d.count) * 50 + 50)
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            keyword: term,
            vibeScore,
            total,
            positive,
            negative,
            neutral,
            positivePercent: total > 0 ? Math.round((positive / total) * 100) : 0,
            negativePercent: total > 0 ? Math.round((negative / total) * 100) : 0,
            neutralPercent: total > 0 ? Math.round((neutral / total) * 100) : 0,
            articles: analyzedArticles.slice(0, 10),
            trendData,
            timestamp: new Date().toLocaleString()
        };
    };

    const analyzeVibe = async (searchTerm: string) => {
        if (!searchTerm.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/vibe?keyword=${encodeURIComponent(searchTerm)}&language=${language}`);
            const data = await response.json();
            if (!response.ok || data.error) throw new Error(data.error || t.vibe.error);
            setVibeData(performSentimentAnalysis(data.articles, searchTerm));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getVibeColor = (score: number) => {
        if (score >= 65) return 'text-emerald-400';
        if (score >= 45) return 'text-amber-400';
        return 'text-red-400';
    };
    const getVibeLabel = (score: number) => {
        if (score >= 75) return t.vibe.veryPositive;
        if (score >= 60) return t.vibe.positive;
        if (score >= 45) return t.vibe.neutral;
        if (score >= 30) return t.vibe.negative;
        return t.vibe.veryNegative;
    };

    useEffect(() => {
        if (keyword && !vibeData) analyzeVibe(keyword);
    }, []);

    return (
        <div id="vibe-checker" className="w-full">
            <div className="glass-card rounded-xl border border-white/5 bg-white/[0.02] relative overflow-hidden flex flex-col md:flex-row">
                {/* Search & Main Score Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

                    {/* Compact Search Header */}
                    <div className="flex items-center gap-3 mb-6 relative z-10 w-full max-w-sm">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && analyzeVibe(keyword)}
                                placeholder={t.vibe.placeholder}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 text-white placeholder-white/20 focus:outline-none focus:bg-black/40 transition-all text-sm font-medium border border-white/5 focus:border-emerald-500/30"
                            />
                        </div>
                        <button
                            onClick={() => analyzeVibe(keyword)}
                            disabled={loading}
                            className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg transition-all shadow-lg shadow-emerald-500/10"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Result Display */}
                    {!vibeData ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                            <Search className="w-12 h-12 mb-4 text-white/10" />
                            <p className="text-sm text-muted-foreground">{t.vibe.subtitle}</p>
                        </div>
                    ) : (
                        <div className="flex flex-row items-center gap-6">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" className="stroke-white/5" strokeWidth="8" fill="none" />
                                    <motion.circle
                                        cx="50" cy="50" r="42"
                                        className={cn("transition-colors duration-500",
                                            vibeData.vibeScore >= 65 ? "stroke-emerald-400" :
                                                vibeData.vibeScore >= 45 ? "stroke-amber-400" : "stroke-red-400"
                                        )}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: vibeData.vibeScore / 100 }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={cn("text-2xl sm:text-3xl font-black tracking-tighter leading-none", getVibeColor(vibeData.vibeScore))}>
                                        {vibeData.vibeScore}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Sentiment</span>
                                <h3 className={cn("text-2xl font-black uppercase tracking-tight italic leading-none mb-3", getVibeColor(vibeData.vibeScore))}>
                                    {getVibeLabel(vibeData.vibeScore)}
                                </h3>

                                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {vibeData.positivePercent}% Pos</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {vibeData.negativePercent}% Neg</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Simplified Article List / Details Sidebar */}
                {vibeData && (
                    <div className="flex-1 bg-black/10 border-l border-white/5 p-4 md:p-6 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-3.5 h-3.5" /> Source Data
                            </h4>
                            <span className="text-[10px] text-white/20">{vibeData.total} Articles Analyzed</span>
                        </div>

                        {/* Tiny Graph */}
                        <div className="h-24 w-full mb-4 opacity-50 hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={vibeData.trendData.slice(-7)}>
                                    <defs>
                                        <linearGradient id="vibeSimpleGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fill="url(#vibeSimpleGradient)" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Compact List */}
                        <div className="flex-1 overflow-y-auto max-h-[200px] pr-2 space-y-1.5 custom-scrollbar">
                            {vibeData.articles.map((article, i) => (
                                <a
                                    key={i}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                >
                                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                                        article.sentiment === 'positive' ? "bg-emerald-500" :
                                            article.sentiment === 'negative' ? "bg-red-500" : "bg-amber-500"
                                    )} />
                                    <span className="text-xs text-muted-foreground group-hover:text-white truncate transition-colors">
                                        {article.title}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
