module.exports.api = (client) => {
    const _app = require('./server')
    const app = new _app(client)

    app.listen(process.env.PORT, () => {
        client.log.start("API Iniciada na porta " + process.env.PORT)
    })

    return app
}