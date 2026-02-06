import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface FearGreedData {
    value: string;
    classification: string;
    timestamp: string;
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
    // API is reliable, keep for now but could proxy if needed
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
    // This is now redundant with useMarketData, but keeping signature for compatibility
    const { data, error, isLoading } = useSWR('/api/market-data', fetcher, {
        refreshInterval: 60000,
        revalidateOnFocus: false
    });

    return {
        coins: data?.coins,
        isLoading,
        error,
    };
}

export function useGlobalMarket() {
    // Proxy through macro API or similar if available, or just keep as is
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
    const { data, error, isLoading } = useSWR(
        '/api/market-chart?coinId=bitcoin&days=7',
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
        '/api/market-chart?coinId=ethereum&days=7',
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
