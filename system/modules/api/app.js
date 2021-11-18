module.exports.api = (client) => {
    client.settings == {}
    const _app = require('./server')
    const app = new _app(client)

    app.listen(process.env.PORT, function () {
        client.log.start(`Servidor iniciado na porta: ${process.env.PORT}`)
    });
}

