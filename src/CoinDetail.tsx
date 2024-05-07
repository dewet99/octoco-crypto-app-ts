import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SparklineChart } from './Sparkline';
import { fetchCoinByID, CoinDetails } from './API';


export const CoinDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [coinDetails, setCoinDetails] = useState<CoinDetails | null>(null);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCoinByID(id as string);
                setCoinDetails(data);
                setError(false);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Failed to fetch coins:', error.message);
                    setCoinDetails(null); // Reset coinDetails to null on error
                    setError(true);
                } else {
                    // Handle other types of errors
                    console.error('An unknown error occurred:', error);
                }
            }
        };

        fetchData();
    }, [id, navigate]);

    const GoBackButton: React.FC = () => {
        const goBack = () => {
            navigate(-1);
        };

        return (
            <button onClick={goBack}>Back to Dashboard</button>
        );
    };

    const DetailItem: React.FC<{ label: string; value: string | number; isCurrency?: boolean; isPercentage?: boolean; localeString: string; priceChange?: number }> = ({ label, value, isCurrency = false, isPercentage = false, localeString, priceChange }) => {
        const formatValue = () => {
            if (isCurrency) {
                return `ZAR ${Number(value).toLocaleString(localeString)}`;
            }
            if (isPercentage) {
                return `${Number(value).toLocaleString(localeString)}%`;
            }
            return Number(value).toLocaleString(localeString);
        };

        const valueClass = priceChange ? `${priceChange >= 0 ? 'positive-change' : 'negative-change'}` : '';

        return (
            <div className='detail-item-container'>
                <span className='detail-item-label'>{label}</span>
                <span className={`detail-item-value ${valueClass}`}>{formatValue()}</span>
            </div>
        );
    };

    const CoinDetailContainer: React.FC<{ coinDetails: CoinDetails; localeString: string }> = ({ coinDetails, localeString }) => {
        if (!coinDetails) {
            return <div className='coin-detail-container'>Loading...</div>;
        }

        const { market_data, name, image } = coinDetails;

        return (
            <div className='coin-detail-container'>
                <div className='coin-detail-header-row'>
                    <img src={image?.small} className='coin-detail-header' alt={`${name} logo`} />
                    <h1 className='coin-detail-name'>{name}</h1>
                </div>
                <DetailItem label="Market Rank:" value={market_data.market_cap_rank} localeString={localeString} />
                <DetailItem label="Price:" value={market_data.current_price.zar} isCurrency localeString={localeString} />
                <DetailItem label="Market Cap:" value={market_data.market_cap.zar} isCurrency localeString={localeString} />
                <DetailItem label="24hr Trading Vol:" value={market_data.total_volume.zar} isCurrency localeString={localeString} />
                <DetailItem label="Fully Diluted Valuation:" value={market_data.fully_diluted_valuation.zar} isCurrency localeString={localeString} />
                <DetailItem label="Circulating Supply:" value={market_data.circulating_supply} localeString={localeString} />
                <DetailItem label="Total Supply:" value={market_data.total_supply} localeString={localeString} />
                {market_data.max_supply && <DetailItem label="Max Supply:" value={market_data.max_supply} localeString={localeString} />}
                <DetailItem label="7d Change - ZAR Relative:" value={market_data.price_change_percentage_7d_in_currency.zar} isPercentage localeString={localeString} priceChange={market_data.price_change_percentage_7d_in_currency.zar} />
                <DetailItem label="7d Change - USD Relative:" value={market_data.price_change_percentage_7d_in_currency.usd} isPercentage localeString={localeString} priceChange={market_data.price_change_percentage_7d_in_currency.usd} />
            </div>
        );
    };

    const DetailPage: React.FC = () => (
        <section>
            <GoBackButton />
            <div className='layout-container'>
                <div className='details-and-sparkline-container'>
                    <CoinDetailContainer coinDetails={coinDetails!} localeString={'zar'} />
                    <SparklineChart coinDetails={coinDetails!} />
                </div>
            </div>
        </section>
    );

    if (error) {
        return (
            <h1>Error fetching from API, wait a minute or two and try again</h1>
        );
    }

    return <DetailPage />;
};
