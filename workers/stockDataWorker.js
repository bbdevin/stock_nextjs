self.onmessage = function (e) {
    const { stockHistory, threeMonthsAgo } = e.data;

    const calculateMA = (data, days) => {
        return data.map((item, index, array) => {
            if (index < days - 1) return { x: new Date(item.date).getTime(), y: null };
            const sum = array.slice(index - days + 1, index + 1).reduce((acc, curr) => acc + curr.close, 0);
            return { x: new Date(item.date).getTime(), y: sum / days };
        });
    };

    const calculateBollingerBands = (data, period, multiplier) => {
        const ma = calculateMA(data, period);
        const upper = [];
        const lower = [];

        data.forEach((item, index) => {
            if (index < period - 1) {
                upper.push({ x: new Date(item.date).getTime(), y: null });
                lower.push({ x: new Date(item.date).getTime(), y: null });
            } else {
                const slice = data.slice(index - period + 1, index + 1);
                const std = Math.sqrt(
                    slice.reduce((sum, item) => sum + Math.pow(item.close - ma[index].y, 2), 0) / period
                );
                upper.push({ x: new Date(item.date).getTime(), y: ma[index].y + multiplier * std });
                lower.push({ x: new Date(item.date).getTime(), y: ma[index].y - multiplier * std });
            }
        });

        return { upper, lower };
    };

    // 使用全部數據計算均線和布林帶
    const ma5 = calculateMA(stockHistory, 5);
    const ma10 = calculateMA(stockHistory, 10);
    const ma20 = calculateMA(stockHistory, 20);
    const ma120 = calculateMA(stockHistory, 120);
    const ma240 = calculateMA(stockHistory, 240);
    const bollingerBands = calculateBollingerBands(stockHistory, 20, 2);

    // 只顯示最近三個月的K線和成交量數據
    const recentData = stockHistory.filter(item => new Date(item.date).getTime() >= threeMonthsAgo);

    const maxVolume = Math.max(...recentData.map(item => item.volume));

    const processedData = {
        candles: recentData.map(item => ({
            x: new Date(item.date).getTime(),
            y: [item.open, item.high, item.low, item.close].map(Number)
        })),
        volume: recentData.map((item, index, array) => {
            const prevVolume = index > 0 ? array[index - 1].volume : item.volume;
            return {
                x: new Date(item.date).getTime(),
                y: Math.floor(item.volume / 1000),
                fillColor: item.volume >= prevVolume ? '#FF0000' : '#00AA00'
            };
        }),
        // 過濾均線和布林帶數據，只保留最近三個月的部分
        ma5: ma5.filter(item => item.x >= threeMonthsAgo),
        ma10: ma10.filter(item => item.x >= threeMonthsAgo),
        ma20: ma20.filter(item => item.x >= threeMonthsAgo),
        ma120: ma120.filter(item => item.x >= threeMonthsAgo),
        ma240: ma240.filter(item => item.x >= threeMonthsAgo),
        bollingerUpper: bollingerBands.upper.filter(item => item.x >= threeMonthsAgo),
        bollingerLower: bollingerBands.lower.filter(item => item.x >= threeMonthsAgo)
    };

    self.postMessage({ processedData, maxVolume });
};