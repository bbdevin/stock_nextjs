import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'

const CandlestickChart = dynamic(() => import('./CandlestickChart'), { ssr: false })
const VolumeChart = dynamic(() => import('./VolumeChart'), { ssr: false })

export default function StockChartAnalysis({ chipData, stockHistory }) {
    const [displayedData, setDisplayedData] = useState({ candles: [], volume: [] });
    const [maxVolume, setMaxVolume] = useState(0);

    useEffect(() => {
        if (stockHistory) {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const worker = new Worker(new URL('../workers/stockDataWorker.js', import.meta.url));
            worker.postMessage({ stockHistory, threeMonthsAgo: threeMonthsAgo.getTime() });

            worker.onmessage = (e) => {
                const { processedData, maxVolume } = e.data;
                setDisplayedData(processedData);
                setMaxVolume(maxVolume);
            };

            return () => worker.terminate();
        }
    }, [stockHistory]);

    const sharedOptions = useMemo(() => ({
        chart: {
            id: 'stockChart',
            group: 'stock',
            animations: {
                enabled: false
            },
            zoom: {
                enabled: true
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            },
            tickAmount: 10
        },
        tooltip: {
            x: {
                format: 'yyyy/MM/dd'
            }
        }
    }), []);

    if (!displayedData.candles.length) return <div>Loading...</div>;

    return (
        <>
            <CandlestickChart chipData={chipData} displayedData={displayedData} sharedOptions={sharedOptions} />
            <VolumeChart displayedData={displayedData} sharedOptions={sharedOptions} />
        </>
    )
}