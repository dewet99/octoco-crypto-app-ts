import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CoinProps {
    coinRank: number;
    coin: {
        id: string;
        image: string;
        name: string;
        current_price: number;
        price_change_percentage_1h_in_currency: number;
        price_change_percentage_24h_in_currency: number;
        price_change_percentage_7d_in_currency: number;
        // Add other properties as needed
    };
}

export const Coin: React.FC<CoinProps> = ({ coinRank, coin }) => {
    const navigate = useNavigate();

    if (!navigate) {
        throw new Error ('Navigation not initialised');
    }

    const goToCoinDetail = () => {
        navigate(`/coin/${coin.id}`);
    };

    return (
        <div className='coin-container' >
            <div className='coin-row'>
                <div className='coin-rank'>{coinRank}</div>
                <div className='coin-name' onClick={goToCoinDetail}><img src={coin?.image ?? ''} alt={coin?.id ?? ''}/> {coin.name}</div>
                <div className='coin-price'>{coin.current_price.toLocaleString('zar')}</div>
                <div className={`coin-default ${coin.price_change_percentage_1h_in_currency >= 0 ? 'positive-change' : 'negative-change'}`}>
                    {parseFloat(coin.price_change_percentage_1h_in_currency.toFixed(2))}%
                </div>
                <div className={`coin-default ${coin.price_change_percentage_24h_in_currency >= 0 ? 'positive-change' : 'negative-change'}`}>
                    {parseFloat(coin.price_change_percentage_24h_in_currency.toFixed(2))}%
                </div>
                <div className={`coin-default ${coin.price_change_percentage_7d_in_currency >= 0 ? 'positive-change' : 'negative-change'}`}>
                    {parseFloat(coin.price_change_percentage_7d_in_currency.toFixed(2))}%
                </div>
            </div>
        </div>
    );
};
