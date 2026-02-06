"use client";

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <div className="lg:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 text-muted-foreground hover:text-white transition-colors relative z-[101]"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                            onClick={closeMenu}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.1 }}
                            className="fixed right-4 top-20 z-[100] w-64 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <nav className="flex flex-col py-2">
                                <Link
                                    href="#dashboard"
                                    className="px-6 py-4 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                    onClick={closeMenu}
                                >
                                    {t.header.dashboard}
                                </Link>
                                <Link
                                    href="#arbitrage"
                                    className="px-6 py-4 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                    onClick={closeMenu}
                                >
                                    {t.header.arbitrage}
                                </Link>
                                <Link
                                    href="#vibe-checker"
                                    className="px-6 py-4 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                    onClick={closeMenu}
                                >
                                    {t.vibe.title}
                                </Link>
                                <Link
                                    href="#news"
                                    className="px-6 py-4 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                    onClick={closeMenu}
                                >
                                    {t.header.news}
                                </Link>
                                <Link
                                    href="#influencers"
                                    className="px-6 py-4 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                    onClick={closeMenu}
                                >
                                    {t.influencer.title}
                                </Link>
                                <Link
                                    href="/daily-report"
                                    className="px-6 py-4 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                    onClick={closeMenu}
                                >
                                    {t.header.report}
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
