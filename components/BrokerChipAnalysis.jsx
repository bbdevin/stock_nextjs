import React from 'react'
import { Table, TableBody, TableCell, TableRow } from "./ui/table"

export default function BrokerChipAnalysis({ chipData, startDate, endDate }) {
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
                        className={`absolute top-0 left-0 h-full ${type === 'buy' ? 'bg-red-500' : 'bg-green-500'}`}
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
    )
}