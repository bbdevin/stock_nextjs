module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*', // 指向您的 Flask 後端
            },
        ]
    },
}