import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { API_URL } from '../config';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BrokerTradeData = ({ stockId }) => {
    const [brokerInput, setBrokerInput] = useState('');
    const [brokerData, setBrokerData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        // 設置默認日期範圍為最近三個月
        const end = new Date();
        const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    }, []);

    const fetchBrokerData = async () => {
        if (!brokerInput.trim()) {
            setError('請輸入券商代號或名稱');
            return;
        }

        setError('');
        setBrokerData(null);
        setIsLoading(true);

        try {
            const response = await axios.get(`${API_URL}/broker_data`, {
                params: {
                    stock_id: stockId,
                    broker: brokerInput,
                    start_date: startDate,
                    end_date: endDate
                }
            });
            console.log('API Response:', response.data);
            setBrokerData(response.data);
        } catch (err) {
            console.error('API Error:', err);
            setError(err.response?.data?.error || '發生錯誤，請稍後再試');
        } finally {
            setIsLoading(false);
        }
    };

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 400,
            toolbar: {
                show: false
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
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false,
                format: 'MM/dd',
                rotateAlways: true,
            },
            tickPlacement: 'on',
            title: {
                text: '日期'
            }
        },
        yaxis: {
            title: {
                text: '買賣超(張)'
            },
            labels: {
                formatter: function (val) {
                    return val.toFixed(0);
                }
            }
        },
        tooltip: {
            shared: false,
            intersect: true,
            x: {
                format: 'yyyy/MM/dd'
            },
            y: {
                formatter: function (val) {
                    return val.toFixed(0) + ' 張';
                }
            }
        },
        colors: ['#FF4560', '#00E396']
    };

    return (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">分點進出查詢</h2>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={brokerInput}
                    onChange={(e) => setBrokerInput(e.target.value)}
                    placeholder="輸入券商代號或名稱"
                    className="flex-grow mr-2 p-2 border rounded"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mr-2 p-2 border rounded"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mr-2 p-2 border rounded"
                />
                <button
                    onClick={fetchBrokerData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? '查詢中...' : '查詢'}
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {brokerData && (
                <div>
                    <h3 className="text-xl font-semibold mb-2">{brokerData.broker_name} 對 {brokerData.stock_name}({brokerData.stock_id})個股 單一券商歷史明細</h3>
                    <p className="mb-1">地址: {brokerData.address}</p>
                    <p className="mb-4">電話: {brokerData.phone}</p>

                    <div style={{ height: '400px' }}>
                        <Chart
                            options={chartOptions}
                            series={[{
                                name: '買賣超(張)',
                                data: brokerData.data
                                    .sort((a, b) => new Date(b['日期']) - new Date(a['日期']))
                                    .map(item => ({
                                        x: new Date(item['日期']).getTime(),
                                        y: item['買賣超(張)'],
                                        fillColor: item['買賣超(張)'] >= 0 ? '#FF4560' : '#00E396'
                                    }))
                            }]}
                            type="bar"
                            height={400}
                        />
                    </div>

                    {brokerData.data && brokerData.data.length > 0 ? (
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2">日期</th>
                                        <th className="px-4 py-2">買進(張)</th>
                                        <th className="px-4 py-2">賣出(張)</th>
                                        <th className="px-4 py-2">買賣總額(張)</th>
                                        <th className="px-4 py-2">買賣超(張)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brokerData.data
                                        .sort((a, b) => new Date(b['日期']) - new Date(a['日期']))
                                        .map((item, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                                <td className="border px-4 py-2">{item['日期']}</td>
                                                <td className="border px-4 py-2">{item['買進(張)']}</td>
                                                <td className="border px-4 py-2">{item['賣出(張)']}</td>
                                                <td className="border px-4 py-2">{item['買賣總額(張)']}</td>
                                                <td className="border px-4 py-2">{item['買賣超(張)']}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>沒有可用的交易數據</p>
                    )}

                    <p className="mt-4 font-semibold">期間累計買賣超張數：{brokerData.total_net_buy}</p>
                </div>
            )}
        </div>
    );
};

export default BrokerTradeData;