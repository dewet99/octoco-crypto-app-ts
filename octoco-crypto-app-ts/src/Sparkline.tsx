import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface SparklineChartProps {
  coinDetails: {
    market_data: {
      sparkline_7d: {
        price: number[];
      };
      price_change_percentage_7d_in_currency: {
        usd: number;
      };
    };
    name: string;
  };
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ coinDetails }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const data = coinDetails?.market_data?.sparkline_7d.price;
  const fillColor = coinDetails?.market_data?.price_change_percentage_7d_in_currency.usd >= 0 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
  const lineColor = coinDetails?.market_data?.price_change_percentage_7d_in_currency.usd >= 0 ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)';
  const titleData = coinDetails?.name + ' 7D Price Change - USD';

  useEffect(() => {
    if (chartRef.current && data) {
      const chartCanvas = chartRef.current.getContext('2d');
  
      if (chartCanvas) {
        const chart = new Chart(chartCanvas, {
          type: 'line',
          data: {
            labels: data.map((_, index) => index),
            datasets: [{
              data: data,
              borderColor: lineColor,
              borderWidth: 1,
              fill: true,
              backgroundColor: fillColor
            }],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Index',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'USD Value*',
                },
              },
            },
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.4,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: titleData,
                position: 'top',
              },
            },
            maintainAspectRatio: false,
          },
        });
  
        return () => chart.destroy(); // Clean up the chart instance on unmount
      }
    }
  }, [data]);
  
  return <div className='sparkline-container'><canvas ref={chartRef}></canvas></div>;
};
