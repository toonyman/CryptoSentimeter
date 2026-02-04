"use client";

import { Share2, Link as LinkIcon, Facebook, Twitter, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShareMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
            >
                <Share2 className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-12 rounded-xl bg-card border border-white/10 p-2 shadow-xl flex flex-col gap-1 min-w-[140px] z-50 glass"
                    >
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-medium transition-colors text-left"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <LinkIcon className="w-4 h-4 text-muted-foreground" />}
                            {copied ? "Copied!" : "Copy URL"}
                        </button>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('"Buy the Fear, Sell the Greed!" 📉➡️📈\n\nTrack real-time Kimchi Premium, Coinbase Premium, and global market sentiment data for free on CryptoSentimeter. Check it out now:\n\n#CryptoSentimeter #Bitcoin #FearAndGreed #KimchiPremium #CryptoInvestment #Arbitrage #BTC #CryptoNews')}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-medium transition-colors"
                        >
                            <Twitter className="w-4 h-4 text-blue-400" />
                            X (Twitter)
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-medium transition-colors"
                        >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
