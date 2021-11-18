module.exports = class apiController {
    constructor(client) {
        const { Router, json } = require('express')
        const routes = Router()

        const apiServices = require('../../services/api.services')
        const services = new apiServices(client)

        routes.use(json())

        routes.get('/botinfo', function (req, res) {
            if (req.headers.authorization === process.env.apiToken) {
                res.json(services.getBotinfo())
                res.status(200).end();
                client.log.info("Request na API Autorizada | Botinfo")
            } else {
                res.status(401).end();
                client.log.info("Request na API Negada | Botinfo")
            }
        });

        routes.get('/comandos', (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                const comandos = services.getCommands()

                res.json(comandos)
                res.status(200).end();
                client.log.info("Request na API Autorizada | Comandos")
            } else {
                res.status(401).end();
                client.log.info("Request na API Negada | Comandos")
            }
        });

        return {
            path: '/api/v1', router: routes,
        }

    }
}
    
