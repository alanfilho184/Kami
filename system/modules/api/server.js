module.exports = class server {
    constructor(client) {
        const express = require('express')
        const app = express()

        var RateLimit = require('express-rate-limit')
        app.enable('trust proxy')

        var limiter = new RateLimit({
            windowMs: 1 * 60 * 1000,
            max: 15, 
            delayMs: 0
        });

        app.use(limiter);

        const _controllers = require('./controllers/handle')
        const controllers = new _controllers(client)

        for (var c in controllers.paths) {
            app.use(controllers.paths[c], controllers.routers[c])
        }

        app.use(express.json());

        return app
    }
}