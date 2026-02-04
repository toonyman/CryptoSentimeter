import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface FearGreedData {
    value: string;
    classification: string;
    timestamp: string;
}

export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
}

export interface GlobalData {
    market_cap_percentage: {
        btc: number;
        eth: number;
        usdt: number;
        bnb: number;
        sol: number;
    }
}

export interface ChartData {
    prices: [number, number][]; // [timestamp, price]
}

export function useFearAndGreed() {
    const { data, error, isLoading } = useSWR('https://api.alternative.me/fng/?limit=30', fetcher, {
        refreshInterval: 3600000, // 1 hour
        revalidateOnFocus: false,
    });

    return {
        data: data?.data?.[0] as FearGreedData | undefined,
        history: data?.data as FearGreedData[] | undefined,
        isLoading,
        error,
    };
}

export function useCryptoPrices() {
    const { data, error, isLoading } = useSWR(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
        fetcher,
        {
            refreshInterval: 60000, // 1 minute
            revalidateOnFocus: false
        }
    );

    return {
        coins: data as CoinData[] | undefined,
        isLoading,
        error,
    };
}

export function useGlobalMarket() {
    const { data, error, isLoading } = useSWR('https://api.coingecko.com/api/v3/global', fetcher, {
        refreshInterval: 300000,
        revalidateOnFocus: false
    });

    return {
        data: data?.data as GlobalData | undefined,
        isLoading,
        error
    };
}

export function useBitcoinChart() {
    // 7 Days of data with hourly granularity (automatically mostly by endpoint)
    const { data, error, isLoading } = useSWR(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7',
        fetcher,
        {
            refreshInterval: 600000, // 10 mins
            revalidateOnFocus: false
        }
    );

    return {
        chartData: data as ChartData | undefined,
        isLoading,
        error
    };
}

export function useEthChart() {
    const { data, error, isLoading } = useSWR(
        'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7',
        fetcher,
        {
            refreshInterval: 600000, // 10 mins
            revalidateOnFocus: false
        }
    );

    return {
        chartData: data as ChartData | undefined,
        isLoading,
        error
    };
}
