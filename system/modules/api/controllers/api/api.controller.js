module.exports = class apiController {
    constructor(client) {
        const { Router, json } = require('express');
        const routes = Router()

        const apiService = require("../../services/api/api.services")
        const services = new apiService(client)

        routes.use(json());

        routes.get("/ping", (req, res) => {
            res.status(200).end()
            client.log.info("/ping endpoint recebido")
        })

        routes.post("/log", (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    services.log(req.body)
                    res.status(201).end()
                    client.log.info("/log endpoint autorizado")
                }
                catch (err) {
                    res.status(500).end()
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/log endpoint não autorizado")
            }
        })

        //routes.get("/analytics")

        return { path: '/api/v1/', router: routes }
    }

}

