import React, { useState, useEffect } from 'react';
import { Coin } from './Coin';

interface CoinData {
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

export const Dashboard: React.FC = React.memo(() => {
    const [topCoins, setTopCoins] = useState<CoinData[]>([]);

    useEffect(() => {
        fetchTopCoins();
    }, []);

    const fetchTopCoins = async () => {
        const cacheKey = 'topCoinsData';
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

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data: CoinData[] = await response.json();

            setTopCoins(data);

            // Cache data
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            console.log("Cached data");
        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to fetch coins:', error.message);
        
                const fallBackData = sessionStorage.getItem(cacheKey);
                if (fallBackData) {
                    setTopCoins(JSON.parse(fallBackData) as CoinData[]);
                    console.log("Loaded cached data");
                }
            } else {
                // Handle other types of errors
                console.error('An unknown error occurred:', error);
            }
        }
    };

    const dashboardHeader = () => {
        return (
            <div className='coin-container'>
                <div className='coin-row'>
                    <div className='header-id'>Coin Rank</div>
                    <div className='header-name'>Coin Name</div>
                    <div className='header-price'>Price (ZAR)</div>
                    <div className='header-default'>1h</div>
                    <div className='header-default'>24h</div>
                    <div className='header-default'>7d</div>
                </div>
            </div>
        );
    };

    return (
        <section>
            {dashboardHeader()}
            {topCoins.map((coin) => (
                <Coin
                    key={coin.id}
                    coinRank={coin.market_cap_rank}
                    coin={coin}
                />
            ))}
        </section>
    );
});
