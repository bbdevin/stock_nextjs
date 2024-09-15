import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CandlestickChart({ chipData, displayedData, sharedOptions }) {
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2 text-center">{chipData.股票簡稱} ({chipData.股票代號}) K線圖</h3>
            <Chart
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
                                return val ? val.toFixed(2) : 'N/A';
                            }
                        }
                    },
                    tooltip: {
                        custom: function ({ seriesIndex, dataPointIndex, w }) {
                            const o = w.globals.seriesCandleO[0][dataPointIndex];
                            const h = w.globals.seriesCandleH[0][dataPointIndex];
                            const l = w.globals.seriesCandleL[0][dataPointIndex];
                            const c = w.globals.seriesCandleC[0][dataPointIndex];
                            const date = new Date(w.globals.seriesX[0][dataPointIndex]);
                            const ma5 = w.globals.series[1][dataPointIndex];
                            const ma10 = w.globals.series[2][dataPointIndex];
                            const ma20 = w.globals.series[3][dataPointIndex];
                            const ma120 = w.globals.series[4][dataPointIndex];
                            const ma240 = w.globals.series[5][dataPointIndex];
                            const bollingerUpper = w.globals.series[6][dataPointIndex];
                            const bollingerLower = w.globals.series[7][dataPointIndex];
                            return (
                                '<div class="apexcharts-tooltip-box apexcharts-tooltip-candlestick">' +
                                `<div>日期: ${date.toLocaleDateString()}</div>` +
                                '<div>開盤: <span class="value">' + (o ? o.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>最高: <span class="value">' + (h ? h.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>最低: <span class="value">' + (l ? l.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>收盤: <span class="value">' + (c ? c.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>MA5: <span class="value">' + (ma5 ? ma5.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>MA10: <span class="value">' + (ma10 ? ma10.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>MA20: <span class="value">' + (ma20 ? ma20.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>MA120: <span class="value">' + (ma120 ? ma120.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>MA240: <span class="value">' + (ma240 ? ma240.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>布林上軌: <span class="value">' + (bollingerUpper ? bollingerUpper.toFixed(2) : 'N/A') + '</span></div>' +
                                '<div>布林下軌: <span class="value">' + (bollingerLower ? bollingerLower.toFixed(2) : 'N/A') + '</span></div>' +
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
                    },
                    stroke: {
                        curve: 'smooth',
                        width: [1, 2, 2, 2, 2, 2, 2, 2] // K線、MA5、MA10、MA20、MA120、MA240、布林上軌、布林下軌的線寬
                    },
                    legend: {
                        show: true,
                        showForSingleSeries: true,
                        customLegendItems: ['K線', 'MA5', 'MA10', 'MA20', 'MA120', 'MA240', '布林上軌', '布林下軌'],
                        position: 'top'
                    }
                }}
                series={[
                    {
                        name: 'K線',
                        type: 'candlestick',
                        data: displayedData.candles
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: displayedData.ma5,
                        color: '#FFD700' // 金色（深黃色）
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: displayedData.ma10,
                        color: '#8B4513' // 棕色
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: displayedData.ma20,
                        color: '#FF1493' // 深粉色
                    },
                    {
                        name: 'MA120',
                        type: 'line',
                        data: displayedData.ma120,
                        color: '#F4A460' // 米色
                    },
                    {
                        name: 'MA240',
                        type: 'line',
                        data: displayedData.ma240,
                        color: '#00008B' // 深藍色
                    },
                    {
                        name: '布林上軌',
                        type: 'line',
                        data: displayedData.bollingerUpper,
                        color: '#00BFFF' // 亮藍色
                    },
                    {
                        name: '布林下軌',
                        type: 'line',
                        data: displayedData.bollingerLower,
                        color: '#00BFFF' // 亮藍色
                    }
                ]}
                type="candlestick"
                height={400}
            />
        </div>
    );
}