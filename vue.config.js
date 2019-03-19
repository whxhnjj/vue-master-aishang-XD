module.exports = {
    baseUrl: '/',
    productionSourceMap: false,
    devServer: {
        open: true,
        proxy: {
            '/api': {
                target: 'http://10.11.71.207:8000',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
