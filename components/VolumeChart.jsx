import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function VolumeChart({ displayedData, sharedOptions }) {
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2 text-center">成交量</h3>
            <Chart
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
                            text: '成交量 (K張)'
                        },
                        min: 0,
                        labels: {
                            formatter: function (val) {
                                return val ? (val / 1000).toFixed(0) + 'K' : '0';
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
                                '<div>成交量: ' + (value ? Math.floor(value).toLocaleString() : '0') + ' 張</div>' +
                                `<div style="color: ${changeColor}">${changeText}: ${Math.abs(volumeChange).toFixed(0)} 張</div>` +
                                '</div>';
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: '100%'
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
                    data: displayedData.volume
                }]}
                type="bar"
                height={200}
            />
        </div>
    );
}