class server {
    constructor(client) {
        const express = require('express')
        const app = express()

        var RateLimit = require('express-rate-limit')
        app.enable('trust proxy')

        var limiter = new RateLimit({
            windowMs: 10 * 60 * 1000,
            max: 10, 
            delayMs: 0
        });

        app.use(limiter);

        const _controllers = require('./controllers/handle')
        const controllers = new _controllers(client)

        for (var c in controllers.paths) {
            app.use(controllers.paths[c], controllers.router[c])
        }

        app.use(express.json());

        return app
    }
}

module.exports = server