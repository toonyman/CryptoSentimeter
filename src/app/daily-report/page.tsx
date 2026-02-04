import DailyReportContent from '@/components/DailyReportContent';
import { LanguageProvider } from '@/contexts/LanguageContext';

async function getData() {
    const [fngRes, coinsRes, globalRes] = await Promise.all([
        fetch('https://api.alternative.me/fng/?limit=1', { next: { revalidate: 3600 } }),
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false', { next: { revalidate: 60 } }),
        fetch('https://api.coingecko.com/api/v3/global', { next: { revalidate: 3600 } })
    ]);

    const fngData = await fngRes.json();
    const coinsData = await coinsRes.json();
    const globalData = await globalRes.json();

    return {
        fng: fngData.data[0],
        coins: coinsData,
        global: globalData.data
    };
}

export default async function DailyReportPage() {
    const { fng, coins, global } = await getData();

    return (
        <main className="min-h-screen w-full max-w-4xl mx-auto px-4 py-12 md:py-20">
            <LanguageProvider>
                <DailyReportContent fng={fng} coins={coins} global={global} />
            </LanguageProvider>
        </main>
    );
}
