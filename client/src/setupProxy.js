const { createProxyMiddleware } = require('http-proxy-middleware')
const os = require('os')

// Port 5001 for macos
const PORT = os.platform() === 'darwin' ? 5001 : 5001

const HOST = "http://192.168.1.101"

module.exports = function (app) {
    app.use(
        '/server',
        createProxyMiddleware({
            target: `${HOST}:${PORT}`,
            changeOrigin: true,
        })
    )
}
