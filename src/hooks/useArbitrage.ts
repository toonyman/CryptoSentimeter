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
    const { data: apiResponse, isLoading: isApiLoading } = useSWR(
        '/api/market-data',
        fetcher,
        { refreshInterval: 5000 }
    );

    const activeCoins = (apiResponse?.coins && apiResponse.coins.length > 0) ? apiResponse.coins : INITIAL_COINS;
    const usdToKrw = apiResponse?.rates?.KRW || 1400;

    // Check if we are truly loading (no data yet)
    // If apiResponse is missing, we are loading.
    const isLoading = isApiLoading && !apiResponse;

    let arbitrageData: ArbitrageData[] = [];

    if (apiResponse && activeCoins) {
        const upbitData = apiResponse.upbit || [];
        const binanceData = apiResponse.binance || [];
        const coinbaseRates = apiResponse.coinbase || {};

        const upbitMap = new Map(Array.isArray(upbitData) ? upbitData.map((t: any) => [t.market, t.trade_price]) : []);
        const binanceMap = new Map(Array.isArray(binanceData) ? binanceData.map((t: any) => [t.symbol, t.price]) : []);

        arbitrageData = activeCoins.map((coin: CoinGeckoCoin) => {
            const sym = coin.symbol.toUpperCase();

            // Upbit Price
            const upbitPrice = upbitMap.get(`KRW-${sym}`) || 0;

            // Binance Price
            const bPriceStr = binanceMap.get(`${sym}USDT`);
            let binancePrice = bPriceStr ? parseFloat(bPriceStr) : 0;

            // Special cases
            if (sym === 'USDT') {
                binancePrice = 1;
                // approximates
            }

            // Coinbase Price
            const cRate = coinbaseRates[sym];
            const coinbasePrice = cRate ? 1 / parseFloat(cRate) : 0;

            const globalPriceKrw = binancePrice * usdToKrw;

            // Calc Premiums
            // Kimchi Premium: ((Korean Price - Global Price) / Global Price) * 100
            const kimchiPremium = (globalPriceKrw > 0 && upbitPrice > 0)
                ? ((upbitPrice - globalPriceKrw) / globalPriceKrw) * 100
                : 0;

            // Coinbase Premium: ((Coinbase Price - Binance Price) / Binance Price) * 100
            // Often tracked as (Coinbase - Binance) strictly
            const coinbasePremium = (coinbasePrice > 0 && binancePrice > 0)
                ? ((coinbasePrice - binancePrice) / binancePrice) * 100
                : 0;

            // Filter out if critical data is missing (optional, but requested behavior implied cleaning lists)
            if (!upbitPrice && !binancePrice) return null;

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
