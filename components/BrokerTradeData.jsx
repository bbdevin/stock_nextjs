import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const BrokerTradeData = ({ stockCode }) => {
    const [brokerInput, setBrokerInput] = useState('');
    const [tradeData, setTradeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBrokerData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/broker_data/${stockCode}/${brokerInput}`);
            if (!response.ok) {
                throw new Error('無法獲取資料');
            }
            const data = await response.json();
            setTradeData(data.資料);
        } catch (err) {
            setError('獲取資料時發生錯誤');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2 text-center">券商分點交易資料</h3>
            <div className="flex space-x-2 mb-4">
                <Input
                    type="text"
                    value={brokerInput}
                    onChange={(e) => setBrokerInput(e.target.value)}
                    placeholder="輸入券商代號或名稱"
                    className="flex-grow"
                />
                <Button onClick={fetchBrokerData} disabled={loading}>
                    {loading ? '載入中...' : '查詢'}
                </Button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {tradeData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tradeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="日期" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="買賣超股數" fill={(d) => (d.買賣超股數 > 0 ? '#ff0000' : '#00ff00')} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default BrokerTradeData;