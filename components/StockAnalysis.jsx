'use client';

import React, { useState } from 'react'
import axios from 'axios'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableRow } from "./ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function StockAnalysis() {
    const [stockInput, setStockInput] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [chipData, setChipData] = useState(null)
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
            setChipData(response.data)
        } catch (error) {
            console.error('Error fetching chip data:', error)
            setError('獲取數據時出錯，請稍後再試。')
        }
        setLoading(false)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchChipData()
        }
    }

    const maxValue = React.useMemo(() => {
        if (!chipData) return 0
        const allValues = [
            ...chipData.買超分點.slice(1).map(item => parseInt(item.買賣超股數.replace(/,/g, ''))),
            ...chipData.賣超分點.slice(1).map(item => parseInt(item.買賣超股數.replace(/,/g, '')))
        ]
        return Math.max(...allValues)
    }, [chipData])

    const renderTableRow = (item, type) => {
        const value = parseInt(item.買賣超股數.replace(/,/g, ''))
        const percentage = (value / maxValue) * 100

        return (
            <TableRow key={item.券商} className="hover:bg-gray-100">
                <TableCell className="bg-gray-200 text-gray-800 w-1/4 text-sm">{item.券商}</TableCell>
                <TableCell className="relative p-0 w-3/4">
                    <div
                        className={`absolute top-0 left-0 h-full ${type === 'buy' ? 'bg-red-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="relative z-10 px-2 py-1 flex justify-end items-center h-full">
                        <span className={`font-bold ${type === 'buy' ? 'text-red-700' : 'text-green-700'}`}>
                            {item.買賣超股數}張
                        </span>
                    </div>
                </TableCell>
            </TableRow>
        )
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
                    {loading && <p className="text-blue-500 mb-4">正在加載數據...</p>}
                    {!loading && chipData && (
                        <>
                            <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
                                <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
                                    {chipData.股票簡稱}({chipData.股票代號})
                                </h2>
                                <h3 className="text-xl font-semibold mb-2 text-center text-gray-600">
                                    {chipData.股票名稱}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <p><span className="font-semibold">產業別:</span> {chipData.產業別}</p>
                                    <p><span className="font-semibold">上市櫃:</span> {chipData.上市櫃}</p>
                                    <p><span className="font-semibold">公司地址:</span> {chipData.公司地址}</p>
                                    <p><span className="font-semibold">股票過戶機構:</span> {chipData.股票過戶機構}</p>
                                    <p><span className="font-semibold">日期:</span> {chipData.日期}</p>
                                    <p><span className="font-semibold">開始日期:</span> {startDate || '今日'}</p>
                                    <p><span className="font-semibold">結束日期:</span> {endDate || '今日'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold mb-2 text-center">買超分點</h3>
                                    <Table>
                                        <TableBody>
                                            {chipData.買超分點.slice(1).map(item => renderTableRow(item, 'buy'))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-2 text-center">賣超分點</h3>
                                    <Table>
                                        <TableBody>
                                            {chipData.賣超分點.slice(1).map(item => renderTableRow(item, 'sell'))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </>
                    )}
                    {!loading && !chipData && (
                        <p className="text-gray-500 text-center mt-8">請輸入股票代碼或名稱並點擊查詢以獲取數據。</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}