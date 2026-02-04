"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-xs font-semibold"
        >
            <Globe className="w-3 h-3 text-muted-foreground" />
            <span className={language === 'en' ? 'text-primary' : 'text-muted-foreground'}>EN</span>
            <span className="text-white/20">|</span>
            <span className={language === 'ko' ? 'text-primary' : 'text-muted-foreground'}>KR</span>
        </button>
    );
}
