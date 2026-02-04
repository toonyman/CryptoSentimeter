"use client";

import { useNews, NewsItem } from '@/hooks/useNews';
import { Newspaper, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

export function NewsFeed() {
    const { news, isLoading } = useNews();
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-3xl h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Newspaper className="text-blue-400" /> {t.news.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-white/10 text-muted-foreground animate-pulse">{t.news.live}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    [...Array(10)].map((_, i) => (
                        <div key={i} className="animate-pulse flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="h-4 w-3/4 bg-white/5 rounded" />
                            <div className="h-3 w-1/2 bg-white/5 rounded" />
                        </div>
                    ))
                ) : (
                    news?.slice(0, 10).map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group h-full flex flex-col justify-between"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h4 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-300/80">{item.domain}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                                </div>

                                {(item.votes && (item.votes.positive > 0 || item.votes.negative > 0)) && (
                                    <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded">
                                        {item.votes.positive > 0 && (
                                            <span className="flex items-center gap-1 text-green-400/80">
                                                <ThumbsUp className="w-3 h-3" /> {item.votes.positive}
                                            </span>
                                        )}
                                        {item.votes.negative > 0 && (
                                            <span className="flex items-center gap-1 text-red-400/80">
                                                <ThumbsDown className="w-3 h-3" /> {item.votes.negative}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </a>
                    ))
                )}
            </div>
            <div className="mt-6 flex justify-center">
                <button className="text-sm text-muted-foreground hover:text-white transition-colors" onClick={() => window.open('https://cryptopanic.com/', '_blank')}>
                    View More on CryptoPanic
                </button>
            </div>
        </motion.div>
    );
}
