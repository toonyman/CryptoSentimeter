import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface ArbitrageData {
    symbol: string;
    name: string;
    image: string;
    change24h: number;
    marketCap: number;
    marketCapChange24h: number;
    binancePrice: number;
    upbitPrice: number;
    coinbasePrice: number;
    kimchiPremium: number;
    coinbasePremium: number;
}

interface UpbitTicker {
    market: string;
    trade_price: number;
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

// Pre-defined top coins to avoid initial CoinGecko delay
const INITIAL_COINS: CoinGeckoCoin[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', price_change_percentage_24h: 0, market_cap: 1900000000000, market_cap_change_percentage_24h: 0 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', price_change_percentage_24h: 0, market_cap: 350000000000, market_cap_change_percentage_24h: 0 },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', price_change_percentage_24h: 0, market_cap: 80000000000, market_cap_change_percentage_24h: 0 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp.png', price_change_percentage_24h: 0, market_cap: 30000000000, market_cap_change_percentage_24h: 0 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', price_change_percentage_24h: 0, market_cap: 20000000000, market_cap_change_percentage_24h: 0 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', price_change_percentage_24h: 0, market_cap: 15000000000, market_cap_change_percentage_24h: 0 },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', price_change_percentage_24h: 0, market_cap: 14000000000, market_cap_change_percentage_24h: 0 },
    { id: 'chainlink', symbol: 'link', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', price_change_percentage_24h: 0, market_cap: 12000000000, market_cap_change_percentage_24h: 0 },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', price_change_percentage_24h: 0, market_cap: 10000000000, market_cap_change_percentage_24h: 0 },
    { id: 'near', symbol: 'near', name: 'NEAR Protocol', image: 'https://assets.coingecko.com/coins/images/10365/large/near.png', price_change_percentage_24h: 0, market_cap: 8000000000, market_cap_change_percentage_24h: 0 },
    { id: 'tron', symbol: 'trx', name: 'TRON', image: 'https://assets.coingecko.com/coins/images/1094/large/tron.png', price_change_percentage_24h: 0, market_cap: 13000000000, market_cap_change_percentage_24h: 0 },
    { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', price_change_percentage_24h: 0, market_cap: 14000000000, market_cap_change_percentage_24h: 0 },
];

export function useArbitrage() {
    // 1. Fetch Top 30 Coins (Increased for better coverage)
    const { data: coinsData } = useSWR<CoinGeckoCoin[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false',
        fetcher,
        { refreshInterval: 60000, keepPreviousData: true }
    );

    const activeCoins = coinsData || INITIAL_COINS;

    // 2. Fetch Exchange Rate (Cached long-term)
    const { data: exchangeRateData } = useSWR(
        'https://api.exchangerate-api.com/v4/latest/USD',
        fetcher,
        { refreshInterval: 3600000, revalidateOnFocus: false }
    );
    const usdToKrw = exchangeRateData?.rates?.KRW || 1400;

    // 3. Construct markets string for Upbit & Binance in parallel
    // Major coins on Upbit KRW market
    const symbols = activeCoins.map(c => c.symbol.toUpperCase());
    const upbitQuery = symbols.map(s => `KRW-${s}`).join(',');

    // Binance specific symbols to reduce payload size
    const binanceSymbolsQuery = JSON.stringify(symbols.map(s => `${s}USDT`));

    // 4. Parallel Price Fetching
    const { data: upbitData, isLoading: upbitLoading } = useSWR<UpbitTicker[]>(
        `https://api.upbit.com/v1/ticker?markets=${upbitQuery}`,
        fetcher,
        { refreshInterval: 5000, keepPreviousData: true }
    );

    const { data: binanceData, isLoading: binanceLoading } = useSWR<BinanceTicker[]>(
        `https://api.binance.com/api/v3/ticker/price?symbols=${binanceSymbolsQuery}`,
        fetcher,
        { refreshInterval: 5000, keepPreviousData: true }
    );

    const { data: coinbaseData } = useSWR<CoinbaseRates>(
        `https://api.coinbase.com/v2/exchange-rates?currency=USD`,
        fetcher,
        { refreshInterval: 10000, keepPreviousData: true }
    );

    // Initial loading is ONLY true if we have literally NO price data yet
    const isLoading = !upbitData && !binanceData && !coinsData;

    let arbitrageData: ArbitrageData[] = [];

    if (activeCoins && (upbitData || binanceData)) {
        const upbitMap = new Map(Array.isArray(upbitData) ? upbitData.map(t => [t.market, t.trade_price]) : []);
        const binanceMap = new Map(Array.isArray(binanceData) ? binanceData.map(t => [t.symbol, t.price]) : []);
        const coinbaseRates = coinbaseData?.data?.rates || {};

        arbitrageData = activeCoins.map((coin) => {
            const sym = coin.symbol.toUpperCase();

            const upbitPrice = upbitMap.get(`KRW-${sym}`) || 0;
            const bPriceStr = binanceMap.get(`${sym}USDT`);
            let binancePrice = bPriceStr ? parseFloat(bPriceStr) : 0;
            if (sym === 'USDT') binancePrice = 1;

            // Optional: Skip if no price from both major sources
            if (!upbitPrice && !binancePrice) return null;

            const cRate = coinbaseRates[sym];
            const coinbasePrice = cRate ? 1 / parseFloat(cRate) : 0;

            const globalPriceKrw = binancePrice * usdToKrw;
            const kimchiPremium = (globalPriceKrw && upbitPrice) ? ((upbitPrice - globalPriceKrw) / globalPriceKrw) * 100 : 0;
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
