import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fallback Coins (Top 15) to use if CoinGecko fails
        const FALLBACK_COINS = [
            { symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'link', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'shib', name: 'Shiba Inu', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 },
            { symbol: 'dot', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', market_cap: 0, price_change_percentage_24h: 0, market_cap_change_percentage_24h: 0 }
        ];

        // 1. Fetch Top Coins from CoinGecko
        // Note: CoinGecko has strict rate limits. In production, caching is essential.
        const coinsRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false', { next: { revalidate: 60 } });

        // Fallback if CoinGecko fails (e.g. rate limit)
        let coinsData = [];
        if (coinsRes.ok) {
            coinsData = await coinsRes.json();
        } else {
            console.warn('CoinGecko fetch failed, using fallback list');
            coinsData = FALLBACK_COINS;
        }

        // 2. Fetch Exchange Rate
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD', { next: { revalidate: 3600 } });
        const rateData = await rateRes.json();
        const usdToKrw = rateData?.rates?.KRW || 1400;

        // 3. Prepare Symbols
        // Only proceed if we have coins
        let upbitData: any[] = [];
        let binanceData: any[] = [];
        let coinbaseRates: any = {};

        if (coinsData.length > 0) {
            const symbols = coinsData.map((c: any) => c.symbol.toUpperCase());

            // Upbit Query
            const upbitQuery = symbols.map((s: string) => `KRW-${s}`).join(',');

            // Binance Query
            // Binance symbols need to be exact. USDT pairs.
            const binanceSymbolsQuery = JSON.stringify(symbols.map((s: string) => `${s}USDT`));

            // 4. Fetch Prices in Parallel
            const [upbitRes, binanceRes, coinbaseRes] = await Promise.all([
                fetch(`https://api.upbit.com/v1/ticker?markets=${upbitQuery}`, { cache: 'no-store' }),
                fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${binanceSymbolsQuery}`, { cache: 'no-store' }),
                fetch(`https://api.coinbase.com/v2/exchange-rates?currency=USD`, { next: { revalidate: 60 } })
            ]);

            if (upbitRes.ok) upbitData = await upbitRes.json();
            if (binanceRes.ok) binanceData = await binanceRes.json();
            if (coinbaseRes.ok) {
                const cbJson = await coinbaseRes.json();
                coinbaseRates = cbJson?.data?.rates || {};
            }
        }

        return NextResponse.json({
            success: true,
            coins: coinsData,
            rates: { KRW: usdToKrw },
            upbit: upbitData,
            binance: binanceData,
            coinbase: coinbaseRates
        });

    } catch (error: any) {
        console.error('Market Data API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}
