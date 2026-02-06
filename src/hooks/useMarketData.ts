import useSWR from 'swr';
import { useMemo } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    market_cap_change_percentage_24h: number;
}

export interface ArbitrageItem extends CoinData {
    binancePrice: number;
    upbitPrice: number;
    coinbasePrice: number;
    kimchiPremium: number;
    coinbasePremium: number;
}

export interface MarketDataResponse {
    success: boolean;
    coins: CoinData[];
    rates: { KRW: number };
    upbit: any[];
    binance: any[];
    coinbase: Record<string, string>;
}

export function useMarketData() {
    const { data, error, isLoading, mutate } = useSWR<MarketDataResponse>(
        '/api/market-data',
        fetcher,
        {
            refreshInterval: 10000, // 10 seconds for premium/price freshnes
            revalidateOnFocus: false,
            dedupingInterval: 2000,
        }
    );

    const processedData = useMemo(() => {
        if (!data || !data.success) return null;

        const { coins, rates, upbit, binance, coinbase } = data;
        const usdToKrw = rates.KRW;

        const upbitMap = new Map(upbit.map((t: any) => [t.market, t.trade_price]));
        const binanceMap = new Map(binance.map((t: any) => [t.symbol, t.price]));

        const items: ArbitrageItem[] = coins.map((coin) => {
            const sym = coin.symbol.toUpperCase();

            // Prices
            const upbitPrice = upbitMap.get(`KRW-${sym}`) || 0;
            const bPriceStr = binanceMap.get(`${sym}USDT`);
            let binancePrice = bPriceStr ? parseFloat(bPriceStr) : 0;

            if (sym === 'USDT') binancePrice = 1;

            const cRate = coinbase[sym];
            const coinbasePrice = cRate ? 1 / parseFloat(cRate) : 0;

            // Premiums
            const globalPriceKrw = binancePrice * usdToKrw;
            const kimchiPremium = (globalPriceKrw > 0 && upbitPrice > 0)
                ? ((upbitPrice - globalPriceKrw) / globalPriceKrw) * 100
                : 0;

            const coinbasePremium = (coinbasePrice > 0 && binancePrice > 0)
                ? ((coinbasePrice - binancePrice) / binancePrice) * 100
                : 0;

            return {
                ...coin,
                binancePrice,
                upbitPrice,
                coinbasePrice,
                kimchiPremium,
                coinbasePremium
            };
        });

        return {
            items,
            exchangeRate: usdToKrw,
            raw: data
        };
    }, [data]);

    return {
        data: processedData,
        isLoading,
        error,
        refresh: mutate
    };
}
