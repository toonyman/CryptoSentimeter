import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ArbitrageData {
    symbol: string;
    name: string;
    image: string;
    change24h: number;
    marketCap: number;
    marketCapChange24h: number;
    binancePrice: number; // USD
    upbitPrice: number;   // KRW
    coinbasePrice: number; // USD
    kimchiPremium: number; // %
    coinbasePremium: number; // %
}

interface UpbitTicker {
    market: string;
    trade_price: number;
}

interface UpbitMarket {
    market: string;
    korean_name: string;
    english_name: string;
}

interface BinanceTicker {
    symbol: string;
    price: string;
}

interface CoinbaseRates {
    data: {
        currency: string;
        rates: Record<string, string>;
    }
}

interface CoinGeckoCoin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    price_change_percentage_24h: number;
    market_cap: number;
    market_cap_change_percentage_24h: number;
}

export function useArbitrage() {
    // 1. Fetch Top 20 Coins
    const { data: coinsData, error: coinsError, isLoading: coinsLoading } = useSWR<CoinGeckoCoin[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
        fetcher,
        { refreshInterval: 60000, keepPreviousData: true }
    );

    // 2. Fetch USD/KRW Exchange Rate
    const { data: exchangeRateData } = useSWR(
        'https://api.exchangerate-api.com/v4/latest/USD',
        fetcher,
        { refreshInterval: 600000, revalidateOnFocus: false }
    );
    const usdToKrw = exchangeRateData?.rates?.KRW || 1400;

    // 3. Fetch All Upbit Markets
    const { data: upbitMarketList } = useSWR<UpbitMarket[]>(
        'https://api.upbit.com/v1/market/all?isDetails=false',
        fetcher,
        { revalidateOnFocus: false, revalidateOnReconnect: false }
    );

    let validUpbitMarketsString = '';
    const validMarketsSet = new Set<string>();

    if (coinsData && upbitMarketList) {
        upbitMarketList.forEach(m => {
            if (m.market.startsWith('KRW-')) validMarketsSet.add(m.market);
        });

        const compatibleSymbols = coinsData
            .map(c => `KRW-${c.symbol.toUpperCase()}`)
            .filter(market => validMarketsSet.has(market));

        validUpbitMarketsString = compatibleSymbols.join(',');
    }

    // 4. Fetch Upbit Tickers
    const { data: upbitData, error: upbitError, isLoading: upbitLoading } = useSWR<UpbitTicker[]>(
        validUpbitMarketsString ? `https://api.upbit.com/v1/ticker?markets=${validUpbitMarketsString}` : null,
        fetcher,
        { refreshInterval: 10000, keepPreviousData: true }
    );

    // 5. Fetch Binance Tickers
    const { data: binanceData, error: binanceError, isLoading: binanceLoading } = useSWR<BinanceTicker[]>(
        `https://api.binance.com/api/v3/ticker/price`,
        fetcher,
        { refreshInterval: 10000, keepPreviousData: true }
    );

    // 6. Fetch Coinbase Tickers
    const { data: coinbaseData } = useSWR<CoinbaseRates>(
        `https://api.coinbase.com/v2/exchange-rates?currency=USD`,
        fetcher,
        { refreshInterval: 10000, keepPreviousData: true }
    );

    const isLoading = (!coinsData && !coinsError) ||
        (!binanceData && !binanceError) ||
        (validUpbitMarketsString && !upbitData && !upbitError);

    let arbitrageData: ArbitrageData[] = [];

    if (coinsData && binanceData && upbitData) {
        // Optimization: Create lookups for O(1) access
        const upbitMap = new Map(upbitData.map(t => [t.market, t.trade_price]));
        const binanceMap = new Map(binanceData.map(t => [t.symbol, t.price]));
        const coinbaseRates = coinbaseData?.data?.rates || {};

        arbitrageData = coinsData.map((coin) => {
            const sym = coin.symbol.toUpperCase();

            const upbitPrice = upbitMap.get(`KRW-${sym}`);
            if (!upbitPrice) return null;

            const bPriceStr = binanceMap.get(`${sym}USDT`);
            let binancePrice = bPriceStr ? parseFloat(bPriceStr) : 0;
            if (sym === 'USDT') binancePrice = 1;

            const cRate = coinbaseRates[sym];
            const coinbasePrice = cRate ? 1 / parseFloat(cRate) : 0;

            const globalPriceKrw = binancePrice * usdToKrw;
            const kimchiPremium = globalPriceKrw ? ((upbitPrice - globalPriceKrw) / globalPriceKrw) * 100 : 0;
            const coinbasePremium = (coinbasePrice > 0 && binancePrice > 0)
                ? ((coinbasePrice - binancePrice) / binancePrice) * 100
                : 0;

            return {
                symbol: sym,
                name: coin.name,
                image: coin.image,
                change24h: coin.price_change_percentage_24h,
                marketCap: coin.market_cap,
                marketCapChange24h: coin.market_cap_change_percentage_24h,
                binancePrice,
                upbitPrice,
                coinbasePrice,
                kimchiPremium,
                coinbasePremium
            };
        }).filter(Boolean) as ArbitrageData[];
    }

    return {
        data: arbitrageData,
        isLoading, // Keep loading until all data including upbit validation is done
        exchangeRate: usdToKrw,
    };
}
