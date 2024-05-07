
import React, { useState, useEffect } from 'react';
import { Coin } from './Coin';
import { fetchTopCoins, CoinData } from './API.tsx'; // Import API function
import './styles.css';

export const Dashboard: React.FC = React.memo(() => {
    const [topCoins, setTopCoins] = useState<CoinData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTopCoins();
                setTopCoins(data);
                setLoading(false);
                sessionStorage.setItem('topCoinsData', JSON.stringify(data));
                console.log('Cached data');
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Failed to fetch coins:', error.message);
                    setError('Failed to fetch data. Please try again later. This is probably due to the API rate limit.');
                    setLoading(false);
                } else {
                    console.error('An unknown error occurred:', error);
                }

            }
        };

        fetchData();

        // Cleanup function if needed
    }, []);

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

    const renderContent = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <>
                {dashboardHeader()}
                {topCoins.map((coin) => (
                    <Coin
                        key={coin.id}
                        coinRank={coin.market_cap_rank}
                        coin={coin}
                    />
                ))}
            </>
        );
    };



    return (
        <section>
            {renderContent()}
        </section>
    );
});
