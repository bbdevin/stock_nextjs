# 股票資訊查詢系統（前端）

這是一個使用 Next.js 開發的股票資訊查詢系統前端應用。

## 系統功能

1. 股票籌碼資料查詢
2. 股票歷史價格和成交量圖表顯示
3. 券商買賣超分點分析
4. 單一券商交易資料查詢

## 使用的主要套件

- Next.js: React 框架，用於建構用戶界面
- Axios: 用於發送 HTTP 請求
- ApexCharts: 用於繪製互動式圖表
- Tailwind CSS: 用於快速構建自定義設計的用戶界面

完整的依賴列表請參考 `package.json` 文件。

## 安裝和運行

1. 安裝依賴：

   ```bash
   npm install
   ```

2. 運行開發服務器：

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. 構建生產版本：

   ```bash
   npm run build
   ```

4. 運行生產版本：
   ```bash
   npm start
   ```

## 環境配置

在 `config.js` 文件中配置 API 地址：

```javascript
const dev = process.env.NODE_ENV !== "production";
export const API_URL = dev
  ? "http://localhost:5000"
  : "https://api-stock.techtrever.site";
```

## 主要組件

- `StockAnalysis`: 主要的股票分析組件
- `BrokerChipAnalysis`: 顯示券商買賣超分點資料
- `StockChartAnalysis`: 顯示股票歷史價格和成交量圖表
- `BrokerTradeData`: 顯示單一券商的交易資料

## 現有狀況

目前系統已實現基本的股票資訊查詢功能，包括籌碼資料、歷史價格圖表和券商交易資料。用戶界面採用響應式設計，適合在不同設備上使用。

## 未來開發計劃

1. 關鍵分點清單：

   - 實現對重要券商或特定條件的分點進行標記和追蹤
   - 提供自定義關鍵分點的功能

2. 分點追蹤系統：

   - 開發分點歷史交易記錄查詢功能
   - 實現分點交易趨勢分析和可視化
   - 添加分點交易警報功能

3. 優化用戶體驗：

   - 改進資料加載速度和效能
   - 增加更多自定義選項和過濾器

4. 資料分析增強：

   - 加入更多技術指標和分析工具
   - 實現跨股票、跨券商的對比分析功能

5. 移動端適配：
   - 優化移動設備上的使用體驗
   - 考慮開發原生移動應用

## 注意事項

- 本系統僅供教育和研究目的使用，不應用於實際投資決策。
- 請確保遵守所有相關的資料使用條款和版權規定。

## 貢獻

如果您發現任何問題或有改進建議，請提交 issue 或 pull request。

## 許可證

[MIT License](LICENSE)
