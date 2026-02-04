import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Fetch Top Coins from CoinGecko
        // Note: CoinGecko has strict rate limits. In production, caching is essential.
        const coinsRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false', { next: { revalidate: 60 } });

        // Fallback if CoinGecko fails (e.g. rate limit)
        let coinsData = [];
        if (coinsRes.ok) {
            coinsData = await coinsRes.json();
        } else {
            console.warn('CoinGecko fetch failed, returning empty list');
            // We could return a static fallback list here if needed, but client handles empty states too
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
