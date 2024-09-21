'use client';

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import BrokerChipAnalysis from './BrokerChipAnalysis'
import StockChartAnalysis from './StockChartAnalysis'
import BrokerTradeData from './BrokerTradeData'

export default function StockAnalysis() {
    const [stockInput, setStockInput] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [chipData, setChipData] = useState(null)
    const [stockHistory, setStockHistory] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchChipData = async () => {
        if (!stockInput.trim()) {
            setError('請輸入有效的股票代碼或名稱')
            return
        }
        setLoading(true)
        setError(null)
        try {
            let url = `http://localhost:5000/api/chip_data/${encodeURIComponent(stockInput)}`
            let params = {}
            if (startDate && endDate) {
                params.start_date = startDate
                params.end_date = endDate
            }
            const response = await axios.get(url, { params })
            setChipData(response.data);
            await fetchStockHistory(response.data.股票代號);
        } catch (error) {
            console.error('Error fetching chip data:', error)
            setError('獲取資料時出錯，請稍後再試。')
        }
        setLoading(false)
    }

    const fetchStockHistory = async (stockCode) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/stock_history/${stockCode}`);
            setStockHistory(response.data);
        } catch (error) {
            console.error('Error fetching stock history:', error);
            setError('獲取股票歷史數據時出錯，請稍後再試。');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchChipData()
        }
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <Card className="shadow-lg">
                <CardHeader className="bg-blue-600 text-white">
                    <CardTitle className="text-2xl font-bold">券商買賣超分點查詢系統</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4 mb-6 mt-4">
                        <Input
                            placeholder="輸入股票代碼或名稱"
                            value={stockInput}
                            onChange={(e) => setStockInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="text-lg"
                        />
                        <div className="flex space-x-2">
                            <Input
                                type="date"
                                placeholder="開始日期"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <Input
                                type="date"
                                placeholder="結束日期"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={fetchChipData}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            {loading ? '查詢中...' : '查詢'}
                        </Button>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {loading && <p className="text-blue-500 mb-4">正在加載資料...</p>}
                    {!loading && chipData && (
                        <BrokerChipAnalysis chipData={chipData} startDate={startDate} endDate={endDate} />
                    )}
                    {!loading && chipData && stockHistory && (
                        <StockChartAnalysis chipData={chipData} stockHistory={stockHistory} />
                    )}
                    {!loading && chipData && stockHistory && (
                        <BrokerTradeData stockId={chipData.股票代號} startDate={startDate} endDate={endDate} />
                    )}
                    {!loading && !chipData && (
                        <p className="text-gray-500 text-center mt-8">請輸入股票代碼或名稱並點擊查詢以獲取資料。</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}