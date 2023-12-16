const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/server',
        createProxyMiddleware({
            target: 'http://localhost:5001',
            changeOrigin: true,
        })
    );
};
