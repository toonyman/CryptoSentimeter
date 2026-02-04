import { NextResponse } from 'next/server';

export async function GET() {
    const API_KEY = process.env.CRYPTOPANIC_API_KEY;

    // If no API key is provided, return mock data for demonstration
    if (!API_KEY) {
        return NextResponse.json({
            results: [
                {
                    id: 1,
                    title: "Bitcoin Surges Past $100k as Institutional Adoption Grows",
                    domain: "coindesk.com",
                    created_at: new Date().toISOString(),
                    slug: "bitcoin-surges",
                    url: "https://coindesk.com",
                    currencies: [{ code: "BTC", title: "Bitcoin" }],
                    votes: { positive: 10, negative: 1, liked: 5 }
                },
                {
                    id: 2,
                    title: "Ethereum Upgrade 'Pectra' Scheduled for Next Month",
                    domain: "cointelegraph.com",
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    slug: "ethereum-pectra",
                    url: "https://cointelegraph.com",
                    currencies: [{ code: "ETH", title: "Ethereum" }],
                    votes: { positive: 8, negative: 0, liked: 3 }
                },
                {
                    id: 3,
                    title: "SEC Delays Decision on Solana ETF Again",
                    domain: "decrypt.co",
                    created_at: new Date(Date.now() - 7200000).toISOString(),
                    slug: "solana-etf-delay",
                    url: "https://decrypt.co",
                    currencies: [{ code: "SOL", title: "Solana" }],
                    votes: { positive: 2, negative: 15, liked: 1 }
                },
                {
                    id: 4,
                    title: "Regulatory Clarity Expected in Asian Markets",
                    domain: "bloomberg.com",
                    created_at: new Date(Date.now() - 10800000).toISOString(),
                    slug: "asia-regulation",
                    url: "https://bloomberg.com",
                    currencies: [],
                    votes: { positive: 5, negative: 2, liked: 2 }
                },
                {
                    id: 5,
                    title: "New DeFi Protocol Offers 20% APY on Stablecoins",
                    domain: "theblock.co",
                    created_at: new Date(Date.now() - 14400000).toISOString(),
                    slug: "new-defi-protocol",
                    url: "https://theblock.co",
                    currencies: [{ code: "USDT", title: "Tether" }],
                    votes: { positive: 12, negative: 8, liked: 4 }
                },
                {
                    id: 6,
                    title: "Ripple Wins Key Victory in Ongoing Legal Battle",
                    domain: "cnbc.com",
                    created_at: new Date(Date.now() - 18000000).toISOString(),
                    slug: "ripple-wins",
                    url: "https://cnbc.com",
                    currencies: [{ code: "XRP", title: "XRP" }],
                    votes: { positive: 15, negative: 2, liked: 8 }
                },
                {
                    id: 7,
                    title: "MicroStrategy Buys Another 5,000 BTC",
                    domain: "microstrategy.com",
                    created_at: new Date(Date.now() - 21600000).toISOString(),
                    slug: "microstrategy-buys",
                    url: "https://microstrategy.com",
                    currencies: [{ code: "BTC", title: "Bitcoin" }],
                    votes: { positive: 20, negative: 0, liked: 10 }
                },
                {
                    id: 8,
                    title: "Japan Tax Reform Could Boost Crypto Adoption",
                    domain: "nikkei.com",
                    created_at: new Date(Date.now() - 25200000).toISOString(),
                    slug: "japan-tax-reform",
                    url: "https://nikkei.com",
                    currencies: [],
                    votes: { positive: 8, negative: 1, liked: 3 }
                },
                {
                    id: 9,
                    title: "Cardano Founder Teases Major Partnership",
                    domain: "cardano.org",
                    created_at: new Date(Date.now() - 28800000).toISOString(),
                    slug: "cardano-partnership",
                    url: "https://cardano.org",
                    currencies: [{ code: "ADA", title: "Cardano" }],
                    votes: { positive: 6, negative: 4, liked: 2 }
                },
                {
                    id: 10,
                    title: "Chainlink Integrates with Traditional Banking System",
                    domain: "swift.com",
                    created_at: new Date(Date.now() - 32400000).toISOString(),
                    slug: "chainlink-swift",
                    url: "https://swift.com",
                    currencies: [{ code: "LINK", title: "Chainlink" }],
                    votes: { positive: 18, negative: 1, liked: 9 }
                }
            ]
        });
    }

    try {
        const res = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&public=true&filter=important`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
