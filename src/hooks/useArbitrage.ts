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

// Hardcoded fallback coins in case CoinGecko API is down/throttled
const FALLBACK_COINS: CoinGeckoCoin[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'tether', symbol: 'usdt', name: 'Tether', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'chainlink', symbol: 'link', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'near', symbol: 'near', name: 'NEAR Protocol', image: 'https://assets.coingecko.com/coins/images/10365/large/near.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'tron', symbol: 'trx', name: 'TRON', image: 'https://assets.coingecko.com/coins/images/1094/large/tron.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
    { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', price_change_percentage_24h: 0, market_cap: 0, market_cap_change_percentage_24h: 0 },
];

export function useArbitrage() {
    // 1. Fetch Top 20 Coins
    const { data: coinsData, error: coinsError } = useSWR<CoinGeckoCoin[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
        fetcher,
        { refreshInterval: 60000, keepPreviousData: true }
    );

    const activeCoins = coinsData || (coinsError ? FALLBACK_COINS : null);

    // 2. Fetch USD/KRW Exchange Rate
    const { data: exchangeRateData } = useSWR(
        'https://api.exchangerate-api.com/v4/latest/USD',
        fetcher,
        { refreshInterval: 600000, revalidateOnFocus: false }
    );
    const usdToKrw = exchangeRateData?.rates?.KRW || 1400;

    // 3. Fetch All Upbit Markets
    const { data: upbitMarketList, error: upbitMarketError } = useSWR<UpbitMarket[]>(
        'https://api.upbit.com/v1/market/all?isDetails=false',
        fetcher,
        { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000 }
    );

    let validUpbitMarketsString = '';
    const validMarketsSet = new Set<string>();

    if (activeCoins && upbitMarketList) {
        upbitMarketList.forEach(m => {
            if (m.market.startsWith('KRW-')) validMarketsSet.add(m.market);
        });

        const compatibleSymbols = activeCoins
            .map(c => `KRW-${c.symbol.toUpperCase()}`)
            .filter(market => validMarketsSet.has(market));

        validUpbitMarketsString = compatibleSymbols.join(',');
    }

    // 4. Fetch Upbit Tickers
    const { data: upbitData, error: upbitError } = useSWR<UpbitTicker[]>(
        validUpbitMarketsString ? `https://api.upbit.com/v1/ticker?markets=${validUpbitMarketsString}` : null,
        fetcher,
        { refreshInterval: 10000, keepPreviousData: true }
    );

    // 5. Fetch Binance Tickers
    const { data: binanceData, error: binanceError } = useSWR<BinanceTicker[]>(
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

    // More robust loading state: Only wait for the critical paths that haven't failed yet
    const isLoading = (!activeCoins && !coinsError) ||
        (!binanceData && !binanceError) ||
        (!upbitMarketList && !upbitMarketError) ||
        (validUpbitMarketsString && !upbitData && !upbitError);

    let arbitrageData: ArbitrageData[] = [];

    if (activeCoins && binanceData && upbitData) {
        const upbitMap = new Map(upbitData.map(t => [t.market, t.trade_price]));
        const binanceMap = new Map(binanceData.map(t => [t.symbol, t.price]));
        const coinbaseRates = coinbaseData?.data?.rates || {};

        arbitrageData = activeCoins.map((coin) => {
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
        isLoading,
        exchangeRate: usdToKrw,
    };
}
