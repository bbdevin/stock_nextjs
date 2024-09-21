const dev = process.env.NODE_ENV !== 'production';

export const API_URL = dev ? 'http://localhost:5000' : 'https://api-stock.techtrever.site';