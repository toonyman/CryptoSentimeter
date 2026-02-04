"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ko';

type Translations = {
    [key in Language]: {
        header: {
            dashboard: string;
            arbitrage: string;
            news: string;
            report: string;
        };
        hero: {
            live_data: string;
            title1: string;
            title2: string;
            subtitle: string;
            cta: string;
        };
        fng: {
            title: string;
            next_update: string;
            pending: string;
            cmc_link_text: string;
        };
        dominance: {
            btc_index: string;
            alt_index: string;
        };
        arbitrage_table: {
            title: string;
            pair: string;
            global: string;
            korea: string;
            kimchi_premium: string;
            coinbase_premium: string;
            tip: string;
        };
        market_overview: {
            title: string;
            coin: string;
            price: string;
            change24h: string;
            market_cap: string;
        };
        news: {
            title: string;
            live: string;
        };
        chart: {
            title: string;
        }
    };
};

const translations: Translations = {
    en: {
        header: {
            dashboard: "Dashboard",
            arbitrage: "Arbitrage",
            news: "News",
            report: "Daily Report"
        },
        hero: {
            live_data: "Live Market Data",
            title1: "Buy the Fear.",
            title2: "Sell the Greed.",
            subtitle: "Global market sentiment analysis and real-time arbitrage tracking for smart investors.",
            cta: "Start Tracking"
        },
        fng: {
            title: "Fear & Greed Index",
            next_update: "Next update in",
            pending: "Pending...",
            cmc_link_text: "Check on CoinMarketCap"
        },
        dominance: {
            btc_index: "Bitcoin Index",
            alt_index: "Altcoin Index"
        },
        arbitrage_table: {
            title: "Arbitrage (Premium Tracker)",
            pair: "Pair",
            global: "Global (Binance)",
            korea: "Korea (Upbit)",
            kimchi_premium: "Kimchi %",
            coinbase_premium: "Coinbase %",
            tip: "High Coinbase Premium = US Institutional Buying Pressure."
        },
        market_overview: {
            title: "Market Overview",
            coin: "Coin",
            price: "Price",
            change24h: "24h Change",
            market_cap: "Market Cap"
        },
        news: {
            title: "Latest News",
            live: "Live"
        },
        chart: {
            title: "Bitcoin 7-Day Trend"
        }
    },
    ko: {
        header: {
            dashboard: "대시보드",
            arbitrage: "김치프리미엄",
            news: "뉴스",
            report: "일일 리포트"
        },
        hero: {
            live_data: "실시간 시장 데이터",
            title1: "공포에 매수하고,",
            title2: "탐욕에 매도하라.",
            subtitle: "똑똑한 투자자를 위한 글로벌 시장 심리 분석 및 실시간 차익거래 추적기.",
            cta: "추적 시작하기"
        },
        fng: {
            title: "공포 & 탐욕 지수",
            next_update: "다음 업데이트:",
            pending: "대기중...",
            cmc_link_text: "코인마켓캡에서 확인하기"
        },
        dominance: {
            btc_index: "비트코인 인덱스",
            alt_index: "알트코인 인덱스"
        },
        arbitrage_table: {
            title: "차익거래 (프리미엄 트래커)",
            pair: "페어",
            global: "글로벌 (바이낸스)",
            korea: "한국 (업비트)",
            kimchi_premium: "김프 %",
            coinbase_premium: "코베 %",
            tip: "높은 코인베이스 프리미엄 = 미국 기관 매수 압력 (상승 신호)."
        },
        market_overview: {
            title: "시장 현황",
            coin: "코인",
            price: "현재가",
            change24h: "24시간 변동",
            market_cap: "시가총액"
        },
        news: {
            title: "실시간 뉴스",
            live: "라이브"
        },
        chart: {
            title: "비트코인 7일 추세"
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations[Language];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en'); // Default to English as per recent request

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
