export interface CoinData {
    id: string;
    market_cap_rank: number;
    image: string;
    name: string;
    current_price: number;
    price_change_percentage_1h_in_currency: number;
    price_change_percentage_24h_in_currency: number;
    price_change_percentage_7d_in_currency: number;
    // Add other properties as needed
}

export async function fetchTopCoins(): Promise<CoinData[]> {
    const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
    const params = {
        vs_currency: 'zar',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '1h,24h,7d',
    };
    // Convert params to Record<string, string>
    const searchParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
        searchParams[key] = String(value);
    }
    url.search = new URLSearchParams(searchParams).toString();

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);

        
    }

    const data: CoinData[] = await response.json();
    return data;
}

export interface CoinDetails {
    market_data: {
        market_cap_rank: number;
        current_price: { zar: number };
        market_cap: { zar: number };
        total_volume: { zar: number };
        fully_diluted_valuation: { zar: number };
        circulating_supply: number;
        total_supply: number;
        max_supply?: number;
        price_change_percentage_7d_in_currency: { zar: number, usd: number };
        sparkline_7d: { price: number[] };
    };
    name: string;
    image?: { small: string };
}

export async function fetchCoinByID(id: string): Promise<CoinDetails> {
    const url = new URL(`https://api.coingecko.com/api/v3/coins/${id}`);
    const params = {
        sparkline: true,
        vs_currency: 'zar',
        localisation: 'zar'
    };
    const searchParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
        searchParams[key] = String(value);
    }
    url.search = new URLSearchParams(searchParams).toString();

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);   
        }

        const data: CoinDetails = await response.json();
        return data;

}
