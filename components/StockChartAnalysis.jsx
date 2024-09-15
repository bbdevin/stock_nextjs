import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const ApexCharts = dynamic(() => import('apexcharts'), { ssr: false });

export default function StockChartAnalysis({ chipData, stockHistory }) {
    const [displayedData, setDisplayedData] = useState({ candles: [], volume: [] });
    const [maxVolume, setMaxVolume] = useState(0);
    const chartRef = useRef(null);
    const volumeChartRef = useRef(null);

    useEffect(() => {
        if (stockHistory) {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            const initialData = stockHistory.filter(item => new Date(item.date) >= threeMonthsAgo);

            const initialMaxVolume = Math.max(...initialData.map(item => item.volume));
            setMaxVolume(initialMaxVolume);

            setDisplayedData({
                candles: initialData.map(item => ({
                    x: new Date(item.date).getTime(),
                    y: [item.open, item.high, item.low, item.close].map(Number)
                })),
                volume: initialData.map(item => ({
                    x: new Date(item.date).getTime(),
                    y: Math.floor(item.volume / 1000)
                }))
            });
        }
    }, [stockHistory]);

    useEffect(() => {
        if (chartRef.current && volumeChartRef.current && stockHistory) {
            const candleChart = chartRef.current.chart;
            const volumeChart = volumeChartRef.current.chart;

            const handleScrollLoad = (direction) => {
                if (direction === 'left' && displayedData.candles.length < stockHistory.length) {
                    const newDataPoint = stockHistory[stockHistory.length - displayedData.candles.length - 1];
                    const newCandle = {
                        x: new Date(newDataPoint.date).getTime(),
                        y: [newDataPoint.open, newDataPoint.high, newDataPoint.low, newDataPoint.close].map(Number)
                    };
                    const newVolume = {
                        x: new Date(newDataPoint.date).getTime(),
                        y: Math.floor(newDataPoint.volume / 1000)
                    };

                    candleChart.appendData([{
                        data: [newCandle]
                    }]);

                    volumeChart.appendData([{
                        data: [newVolume]
                    }]);

                    setDisplayedData(prev => ({
                        candles: [newCandle, ...prev.candles],
                        volume: [newVolume, ...prev.volume]
                    }));

                    const newMaxVolume = Math.max(maxVolume, newDataPoint.volume);
                    if (newMaxVolume !== maxVolume) {
                        setMaxVolume(newMaxVolume);
                        volumeChart.updateOptions({
                            yaxis: {
                                max: Math.ceil(newMaxVolume / 1000 / 500) * 500
                            }
                        });
                    }
                }
            };

            candleChart.addEventListener('scrolled', function (e) {
                handleScrollLoad(e.direction);
                volumeChart.updateOptions({
                    xaxis: {
                        min: candleChart.w.globals.minX,
                        max: candleChart.w.globals.maxX
                    }
                });
            });

            return () => {
                candleChart.removeEventListener('scrolled');
            };
        }
    }, [chartRef, volumeChartRef, stockHistory, displayedData, maxVolume]);

    const sharedOptions = {
        chart: {
            id: 'stockChart',
            group: 'stock',
            animations: {
                enabled: false
            },
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            },
            events: {
                zoomed: function (chartContext, { xaxis, yaxis }) {
                    const otherCharts = ApexCharts.getChartsByGroup('stock');
                    otherCharts.forEach(chart => {
                        if (chart !== chartContext.chart) {
                            chart.updateOptions({
                                xaxis: {
                                    min: xaxis.min,
                                    max: xaxis.max
                                }
                            }, false, false);
                        }
                    });
                }
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        tooltip: {
            x: {
                format: 'yyyy/MM/dd'
            }
        }
    };

    return (
        <>
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-2 text-center">{chipData.股票簡稱} ({chipData.股票代號}) K線圖</h3>
                <Chart
                    ref={chartRef}
                    options={{
                        ...sharedOptions,
                        chart: {
                            ...sharedOptions.chart,
                            type: 'candlestick',
                            height: 400,
                        },
                        yaxis: {
                            tooltip: {
                                enabled: true
                            },
                            labels: {
                                formatter: function (val) {
                                    return val.toFixed(2);  // 將小數點限制為兩位
                                }
                            }
                        },
                        tooltip: {
                            custom: function ({ seriesIndex, dataPointIndex, w }) {
                                const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
                                const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
                                const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
                                const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
                                const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
                                return (
                                    '<div class="apexcharts-tooltip-box apexcharts-tooltip-candlestick">' +
                                    `<div>日期: ${date.toLocaleDateString()}</div>` +
                                    '<div>開盤: <span class="value">' + o.toFixed(2) + '</span></div>' +
                                    '<div>最高: <span class="value">' + h.toFixed(2) + '</span></div>' +
                                    '<div>最低: <span class="value">' + l.toFixed(2) + '</span></div>' +
                                    '<div>收盤: <span class="value">' + c.toFixed(2) + '</span></div>' +
                                    '</div>'
                                );
                            }
                        },
                        plotOptions: {
                            candlestick: {
                                colors: {
                                    upward: '#FF0000',
                                    downward: '#00AA00'
                                }
                            }
                        }
                    }}
                    series={[{
                        name: 'K線',
                        data: displayedData.candles
                    }]}
                    type="candlestick"
                    height={400}
                />
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-2 text-center">成交量</h3>
                <Chart
                    ref={volumeChartRef}
                    options={{
                        ...sharedOptions,
                        chart: {
                            ...sharedOptions.chart,
                            type: 'bar',
                            height: 200,
                            brush: {
                                enabled: true,
                                target: 'stockChart'
                            },
                            selection: {
                                enabled: true,
                                xaxis: {
                                    min: displayedData.volume[0]?.x,
                                    max: displayedData.volume[displayedData.volume.length - 1]?.x
                                }
                            }
                        },
                        yaxis: {
                            title: {
                                text: '成交量 (張)'
                            },
                            min: 0,  // 確保 Y 軸從 0 開始
                            labels: {
                                formatter: function (val) {
                                    return (val / 1000).toFixed(0) + 'K';  // 將數值轉換為 K 單位
                                }
                            }
                        },
                        tooltip: {
                            shared: false,
                            intersect: true,
                            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                                const value = series[seriesIndex][dataPointIndex];
                                const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
                                const prevValue = dataPointIndex > 0 ? series[seriesIndex][dataPointIndex - 1] : value;
                                const volumeChange = value - prevValue;
                                const changeText = volumeChange >= 0 ? '量增' : '量縮';
                                const changeColor = volumeChange >= 0 ? 'red' : 'green';
                                return '<div class="apexcharts-tooltip-box">' +
                                    '<div>日期: ' + date.toLocaleDateString() + '</div>' +
                                    '<div>成交量: ' + Math.floor(value).toLocaleString() + ' 張</div>' +
                                    `<div style="color: ${changeColor}">${changeText}: ${Math.abs(volumeChange).toFixed(0)} 張</div>` +
                                    '</div>';
                            }
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: '80%'
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        states: {
                            normal: {
                                filter: {
                                    type: 'none',
                                }
                            },
                            hover: {
                                filter: {
                                    type: 'darken',
                                    value: 0.85,
                                }
                            },
                        }
                    }}
                    series={[{
                        name: '成交量',
                        data: displayedData.volume.map((item, index, array) => {
                            const prevVolume = index > 0 ? array[index - 1].y : item.y;
                            return {
                                x: item.x,
                                y: item.y,  // 保持原有的成交量數值
                                fillColor: item.y < prevVolume ? '#00AA00' : '#FF0000'
                            };
                        })
                    }]}
                    type="bar"
                    height={200}
                />
            </div>
        </>
    )
}