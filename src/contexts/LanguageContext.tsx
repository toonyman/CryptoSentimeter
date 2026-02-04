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
            title: string;
            alt_heavy: string;
            neutral: string;
            btc_heavy: string;
            phase_btc_lead: string;
            desc_btc_lead: string;
            sug_btc_lead: string;
            phase_btc_safe: string;
            desc_btc_safe: string;
            sug_btc_safe: string;
            phase_alt_season: string;
            desc_alt_season: string;
            sug_alt_season: string;
            phase_market_rebound: string;
            desc_market_rebound: string;
            sug_market_rebound: string;
            phase_neutral: string;
            desc_neutral: string;
            sug_neutral: string;
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
        };
        influencer: {
            title: string;
            subtitle: string;
            view_x: string;
            watch_yt: string;
            all: string;
            latest: string;
            ago_2h: string;
            ago_4h: string;
            ago_6h: string;
            ago_8h: string;
            ago_1d: string;
            ago_2d: string;
        };
        vibe: {
            title: string;
            subtitle: string;
            placeholder: string;
            analyze: string;
            analyzing: string;
            score: string;
            trend: string;
            headlines: string;
            veryPositive: string;
            positive: string;
            neutral: string;
            negative: string;
            veryNegative: string;
            basedOn: string;
            share: string;
            copied: string;
            copyUrl: string;
            error: string;
        };
        macro: {
            title: string;
            fed_forecast: string;
            impact_title: string;
        };
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
            alt_index: "Altcoin Index",
            title: "Market Cycle Analysis",
            alt_heavy: "Alt Season",
            neutral: "Neutral",
            btc_heavy: "BTC Season",
            phase_btc_lead: "Bitcoin Dominance",
            desc_btc_lead: "Bitcoin is leading the market with strong dominance and positive price action.",
            sug_btc_lead: "Focus on BTC or major Large-caps. Altcoin momentum is weak.",
            phase_btc_safe: "Bitcoin Safe Haven",
            desc_btc_safe: "Market is shaky, but Bitcoin dominance is rising as capital moves to safety.",
            sug_btc_safe: "Defensive positioning recommended. High risk for small-cap alts.",
            phase_alt_season: "Altcoin Season",
            desc_alt_season: "Capital is rotating from BTC to Altcoins. High growth phase for smaller assets.",
            sug_alt_season: "Look for high-beta Altcoins. BTC dominance is losing ground.",
            phase_market_rebound: "Market Bottoming?",
            desc_market_rebound: "Dominance is low and price is dropping. Possible exhaustion point for sellers.",
            sug_market_rebound: "DCA into quality assets. Watch for clear reversal signs.",
            phase_neutral: "Equilibrium Phase",
            desc_neutral: "Market is searching for direction. Dominance is in a transitional range.",
            sug_neutral: "Wait for a breakout. BTC/Alt stability is currently balanced."
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
        },
        influencer: {
            title: "Influencer Insights",
            subtitle: "Real-time analysis from top crypto figures.",
            view_x: "View on X",
            watch_yt: "Watch on YouTube",
            all: "All",
            latest: "Latest insight",
            ago_2h: "2h ago",
            ago_4h: "4h ago",
            ago_6h: "6h ago",
            ago_8h: "8h ago",
            ago_1d: "1 day ago",
            ago_2d: "2 days ago"
        },
        vibe: {
            title: "Real-time Vibe Checker",
            subtitle: "Market sentiment diagnosis based on news big data",
            placeholder: "Enter coin or keyword (e.g., Bitcoin, Solana, ETF)",
            analyze: "Analyze",
            analyzing: "Analyzing...",
            score: "Vibe Score",
            trend: "Sentiment Trend",
            headlines: "Recent Headlines",
            veryPositive: "Very Positive",
            positive: "Positive",
            neutral: "Neutral",
            negative: "Negative",
            veryNegative: "Very Negative",
            basedOn: "articles analyzed",
            share: "Share",
            copied: "Copied!",
            copyUrl: "Copy URL",
            error: "Failed to fetch data."
        },
        macro: {
            title: "Macro Economic Insights",
            fed_forecast: "Fed Rate Expectation",
            impact_title: "Crypto Market Impact"
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
            alt_index: "알트코인 인덱스",
            title: "시장 사이클 분석",
            alt_heavy: "알트 시즌",
            neutral: "중립",
            btc_heavy: "비트 시즌",
            phase_btc_lead: "비트코인 독주 국면",
            desc_btc_lead: "비트코인이 강력한 지배력과 상승세를 바탕으로 시장을 주도하고 있습니다.",
            sug_btc_lead: "비트코인 및 메이저 대형주 집중 권장. 알트코인 탄력은 약합니다.",
            phase_btc_safe: "비트코인 안전자산화",
            desc_btc_safe: "시장이 불안정하나, 자금이 안전한 비트코인으로 몰리며 점유율이 상승 중입니다.",
            sug_btc_safe: "방어적 포지션 유효. 소형 알트코인은 리빙 리스크가 높습니다.",
            phase_alt_season: "알트코인 시즌",
            desc_alt_season: "자금이 비트코인에서 알트코인으로 순환매되고 있습니다. 고수익 기회 구간입니다.",
            sug_alt_season: "유망한 알트코인 발굴 적기. 비트코인 지배력이 약화되고 있습니다.",
            phase_market_rebound: "바닥 다지기 국면",
            desc_market_rebound: "점유율이 낮고 가격이 하락세이나, 매도세가 진정되며 바닥을 탐색 중입니다.",
            sug_market_rebound: "우량 우량 자산 위주 분할 매수 전략. 반등 시그널을 주시하세요.",
            phase_neutral: "방향성 탐색 구간",
            desc_neutral: "시장 지배력이 중립 범위에 머물며 새로운 추세를 기다리고 있습니다.",
            sug_neutral: "돌파 방향 확인 후 진입 추천. 비트와 알트의 균형이 팽팽합니다."
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
        },
        influencer: {
            title: "인플루언서 인사이트",
            subtitle: "주요 인플루언서들의 실시간 시장 분석 리포트",
            view_x: "X에서 보기",
            watch_yt: "유튜브에서 시청",
            all: "전체",
            latest: "최신 인사이트",
            ago_2h: "2시간 전",
            ago_4h: "4시간 전",
            ago_6h: "6시간 전",
            ago_8h: "8시간 전",
            ago_1d: "1일 전",
            ago_2d: "2일 전"
        },
        vibe: {
            title: "실시간 바이브 분석기",
            subtitle: "뉴스 빅데이터 기반 시장 심리 진단",
            placeholder: "코인 또는 키워드 입력 (예: Bitcoin, Solana, ETF)",
            analyze: "분석하기",
            analyzing: "분석 중...",
            score: "바이브 점수",
            trend: "감성 추이",
            headlines: "최근 주요 뉴스",
            veryPositive: "매우 긍정적",
            positive: "긍정적",
            neutral: "중립적",
            negative: "부정적",
            veryNegative: "매우 부정적",
            basedOn: "개의 기사 분석 결과",
            share: "공유하기",
            copied: "복사됨!",
            copyUrl: "링크 복사",
            error: "데이터를 가져오지 못했습니다."
        },
        macro: {
            title: "거시경제 인사이트",
            fed_forecast: "연준 금리 전망",
            impact_title: "코인 시장 영향"
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
