import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface NewsItem {
    id: number;
    title: string;
    domain: string;
    created_at: string;
    slug: string;
    url: string;
    currencies?: { code: string; title: string }[];
    votes?: { positive: number; negative: number; liked: number };
}

interface NewsResponse {
    results: NewsItem[];
}

export function useNews() {
    const { data, error, isLoading } = useSWR<NewsResponse>(
        '/api/news',
        fetcher,
        {
            refreshInterval: 300000, // 5 minutes
            revalidateOnFocus: false,
        }
    );

    return {
        news: data?.results,
        isLoading,
        error,
    };
}
