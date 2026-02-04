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
    const { data: coinsData } = useSWR<CoinGeckoCoin[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
        fetcher,
        { refreshInterval: 60000 }
    );

    // 2. Fetch USD/KRW Exchange Rate
    const { data: exchangeRateData } = useSWR(
        'https://api.exchangerate-api.com/v4/latest/USD',
        fetcher,
        { refreshInterval: 600000 }
    );
    const usdToKrw = exchangeRateData?.rates?.KRW || 1350;

    // 3. Fetch All Upbit Markets to validate support
    const { data: upbitMarketList } = useSWR<UpbitMarket[]>(
        'https://api.upbit.com/v1/market/all?isDetails=false',
        fetcher,
        { revalidateOnFocus: false }
    );

    // Filter coinsData to only include markets that exist in Upbit

    let validUpbitMarketsString = '';

    if (coinsData && upbitMarketList) {
        // Create a Set of valid KRW markets for checks
        const validMarkets = new Set(upbitMarketList.filter(m => m.market.startsWith('KRW-')).map(m => m.market));

        // Filter our coins to only those compatible
        const compatibleSymbols = coinsData.map(c => {
            const market = `KRW-${c.symbol.toUpperCase()}`;
            return validMarkets.has(market) ? market : null;
        }).filter(Boolean);

        validUpbitMarketsString = compatibleSymbols.join(',');
    }

    // 4. Fetch Upbit Prices (KRW) ONLY for valid markets
    const { data: upbitData } = useSWR<UpbitTicker[]>(
        validUpbitMarketsString ? `https://api.upbit.com/v1/ticker?markets=${validUpbitMarketsString}` : null,
        fetcher,
        { refreshInterval: 10000 }
    );

    // 5. Fetch Binance Prices (All)
    const { data: binanceData } = useSWR<BinanceTicker[]>(
        `https://api.binance.com/api/v3/ticker/price`,
        fetcher,
        { refreshInterval: 10000 }
    );

    // 6. Fetch Coinbase Rates (All)
    const { data: coinbaseData } = useSWR<CoinbaseRates>(
        `https://api.coinbase.com/v2/exchange-rates?currency=USD`,
        fetcher,
        { refreshInterval: 10000 }
    );


    const isLoading = !coinsData || !upbitMarketList || !upbitData || !binanceData || !exchangeRateData;

    let arbitrageData: ArbitrageData[] = [];

    if (!isLoading && coinsData && Array.isArray(upbitData) && Array.isArray(binanceData)) {
        arbitrageData = coinsData.map((coin) => {
            const symbolUpper = coin.symbol.toUpperCase();
            const upbitSymbol = `KRW-${symbolUpper}`;

            // Check if we have data for this symbol
            const upbitTicker = upbitData.find((t) => t.market === upbitSymbol);
            const upbitPrice = upbitTicker ? upbitTicker.trade_price : 0;

            // If upbitPrice is 0 (not in our valid fetch list or filtered out), skip
            if (!upbitPrice) return null;

            const binanceTicker = binanceData.find(t => t.symbol === `${symbolUpper}USDT`);
            let binancePrice = binanceTicker ? parseFloat(binanceTicker.price) : 0;

            if (symbolUpper === 'USDT') {
                binancePrice = 1;
            }

            const coinbasePrice = coinbaseData?.data?.rates[symbolUpper]
                ? 1 / parseFloat(coinbaseData.data.rates[symbolUpper])
                : 0;

            // Kimchi Premium
            const globalPriceKrw = binancePrice * usdToKrw;
            const kimchiPremium = (globalPriceKrw && upbitPrice) ? ((upbitPrice - globalPriceKrw) / globalPriceKrw) * 100 : 0;

            // Coinbase Premium
            let coinbasePremium = 0;
            if (coinbasePrice > 0 && binancePrice > 0) {
                // If coinbase price is very different (e.g. wrapped token), skip?
                // For now, accept it.
                coinbasePremium = ((coinbasePrice - binancePrice) / binancePrice) * 100;
            }

            return {
                symbol: symbolUpper,
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
