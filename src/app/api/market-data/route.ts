import { NextResponse } from 'next/server';

// Common crypto symbols that are usually on both exchanges
const TOP_SYMBOLS = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'DOT', 'TRX', 'SHIB', 'NEAR'];

export async function GET() {
    try {
        // Fallback Coins to use if CoinGecko fails
        const FALLBACK_COINS = TOP_SYMBOLS.map(s => ({
            symbol: s.toLowerCase(),
            name: s,
            image: `https://assets.coingecko.com/coins/images/1/large/${s.toLowerCase()}.png`,
            current_price: 0,
            market_cap: 0,
            price_change_percentage_24h: 0,
            market_cap_change_percentage_24h: 0
        }));

        // 1. Fetch Top Coins from CoinGecko
        const coinsRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false', { next: { revalidate: 60 } });

        let coinsData = [];
        if (coinsRes.ok) {
            coinsData = await coinsRes.json();
        } else {
            coinsData = FALLBACK_COINS;
        }

        // 2. Fetch Exchange Rate & Market Lists
        const [rateRes, upbitMarketsRes, binanceExchangeInfoRes] = await Promise.all([
            fetch('https://api.exchangerate-api.com/v4/latest/USD', { next: { revalidate: 3600 } }).catch(() => null),
            fetch('https://api.upbit.com/v1/market/all', { next: { revalidate: 3600 } }).catch(() => null),
            fetch('https://api.binance.com/api/v3/exchangeInfo', { next: { revalidate: 3600 } }).catch(() => null)
        ]);

        const rateData = rateRes?.ok ? await rateRes.json() : null;
        const usdToKrw = rateData?.rates?.KRW || 1400;

        const symbols = coinsData.map((c: any) => c.symbol.toUpperCase());

        // 3. Filter valid symbols for each exchange
        let validUpbitSymbols = new Set<string>();
        if (upbitMarketsRes?.ok) {
            const markets = await upbitMarketsRes.json();
            markets.forEach((m: any) => {
                if (m.market.startsWith('KRW-')) {
                    validUpbitSymbols.add(m.market.split('-')[1]);
                }
            });
        }

        let validBinanceSymbols = new Set<string>();
        if (binanceExchangeInfoRes?.ok) {
            const info = await binanceExchangeInfoRes.json();
            info.symbols.forEach((s: any) => {
                if (s.status === 'TRADING' && s.quoteAsset === 'USDT') {
                    validBinanceSymbols.add(s.baseAsset);
                }
            });
        }

        const upbitQuery = symbols.filter((s: string) => validUpbitSymbols.has(s)).map((s: string) => `KRW-${s}`).join(',');
        const binanceSymbols = symbols.filter((s: string) => validBinanceSymbols.has(s)).map((s: string) => `${s}USDT`);

        // 4. Fetch Tickers in Parallel
        const [upbitPricesRes, binancePricesRes, coinbaseRes] = await Promise.all([
            upbitQuery ? fetch(`https://api.upbit.com/v1/ticker?markets=${upbitQuery}`, { cache: 'no-store' }).catch(() => null) : Promise.resolve(null),
            binanceSymbols.length > 0 ? fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(JSON.stringify(binanceSymbols))}`, { cache: 'no-store' }).catch(() => null) : Promise.resolve(null),
            fetch(`https://api.coinbase.com/v2/exchange-rates?currency=USD`, { next: { revalidate: 60 } }).catch(() => null)
        ]);

        let upbitData = upbitPricesRes?.ok ? await upbitPricesRes.json() : [];
        let binanceData = binancePricesRes?.ok ? await binancePricesRes.json() : [];
        let coinbaseRates = {};
        if (coinbaseRes?.ok) {
            const cbJson = await coinbaseRes.json();
            coinbaseRates = cbJson?.data?.rates || {};
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
