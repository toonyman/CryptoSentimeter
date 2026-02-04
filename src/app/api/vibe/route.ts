import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const language = searchParams.get('language') || 'en';

    if (!keyword) {
        return NextResponse.json({ error: 'Keyword parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        // Fallback for development if no key is set
        console.warn('NEWS_API_KEY is not set. Returning empty articles.');
        return NextResponse.json({
            success: true,
            articles: [],
            totalResults: 0
        });
    }

    try {
        // For better data availability in crypto, we default to English
        const newsApiLang = 'en';
        // if (language === 'ko') newsApiLang = 'ko';
        // else if (language === 'jp') newsApiLang = 'jp';
        // else if (language === 'es') newsApiLang = 'es';

        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=${newsApiLang}&sortBy=relevancy&pageSize=100&apiKey=${apiKey}`;

        const response = await fetch(newsApiUrl);
        const data = await response.json();

        if (!response.ok || data.status === 'error') {
            return NextResponse.json({
                error: data.message || 'Failed to fetch news',
                errorCode: data.code || 'unknown'
            }, { status: response.status || 500 });
        }

        return NextResponse.json({
            success: true,
            articles: data.articles || [],
            totalResults: data.totalResults || 0
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message || 'Failed to fetch news data'
        }, { status: 500 });
    }
}
