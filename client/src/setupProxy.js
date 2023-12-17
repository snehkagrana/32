const { createProxyMiddleware } = require('http-proxy-middleware')
const os = require('os')

// Port 5001 for macos
const PORT = os.platform() === 'darwin' ? 5001 : 5000

module.exports = function (app) {
    app.use(
        '/server',
        createProxyMiddleware({
            target: `http://localhost:${PORT}`,
            changeOrigin: true,
        })
    )
}
