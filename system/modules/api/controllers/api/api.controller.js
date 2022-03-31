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

        routes.get("/user", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const user = await services.getUser(req.body.id)
                    res.status(200).json(user)
                    client.log.info("/userInfo endpoint autorizado")
                }
                catch (err) {
                    res.status(500).end()
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/userInfo endpoint não autorizado")
            }
        })

        routes.get("/beta", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const isBeta = await services.isBeta(req.body)
                    res.status(200).json(isBeta)
                    client.log.info("/isBeta endpoint autorizado")
                }
                catch (err) {
                    res.status(500).end()
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/isBeta endpoint não autorizado")
            }
        })

        routes.get("/ficha", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const ficha = await services.getFicha(req.body.id, req.body.nomerpg)
                    res.status(200).json(ficha)
                    client.log.info("/ficha endpoint autorizado")
                }
                catch (err) {
                    res.status(500).end()
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/ficha endpoint não autorizado")
            }
        })

        routes.put("/ficha/atb/update", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const update = await services.updateAtbFicha(req.body)
                    if (update.status == 200) {
                        res.status(200).end()
                    }
                    else {
                        res.status(update.status).json({
                            title: update.title,
                            text: update.text
                        })
                    }
                    client.log.info("/ficha/atb/update endpoint autorizado")
                }
                catch (err) {
                    res.status(500).json(
                        {
                            title: "Erro interno",
                            text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                        }
                    )
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/ficha/atb/update endpoint não autorizado")
            }
        })

        routes.delete("/ficha/atb/remove", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const update = await services.removeAtbFicha(req.body)
                    if (update.status == 200) {
                        res.status(200).end()
                    }
                    else {
                        res.status(update.status).json({
                            title: update.title,
                            text: update.text
                        })
                    }
                    client.log.info("/ficha/atb/remove endpoint autorizado")
                }
                catch (err) {
                    res.status(500).json(
                        {
                            title: "Erro interno",
                            text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                        }
                    )
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/ficha/atb/remove endpoint não autorizado")
            }
        })

        routes.post("/ficha/create", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const create = await services.createFicha(req.body.ficha)
                    if (create.status == 200) {
                        res.status(200).end()
                    }
                    else {
                        res.status(create.status).json({
                            title: create.title,
                            text: create.text
                        })
                    }
                    client.log.info("/ficha/create endpoint autorizado")
                }
                catch (err) {
                    res.status(500).json(
                        {
                            title: "Erro interno",
                            text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                        }
                    )
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/ficha/create endpoint não autorizado")
            }
        })

        routes.patch("/ficha/update", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const update = await services.updateFicha(req.body)
                    if (update.status == 200) {
                        res.status(200).end()
                    }
                    else {
                        res.status(update.status).json({
                            title: update.title,
                            text: update.text
                        })
                    }
                    client.log.info("/ficha/atb/update endpoint autorizado")
                }
                catch (err) {
                    res.status(500).json(
                        {
                            title: "Erro interno",
                            text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                        }
                    )
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/ficha/atb/update endpoint não autorizado")
            }
        })

        routes.patch("/ficha/rename", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const rename = await services.renameFicha(req.body)
                    if (rename.status == 200) {
                        res.status(200).json({
                            novonomerpg: rename.novonomerpg
                        })
                    }
                    else {
                        res.status(rename.status).json({
                            title: rename.title,
                            text: rename.text
                        })
                    }
                    client.log.info("/ficha/atb/rename endpoint autorizado")
                }
                catch (err) {
                    res.status(500).json(
                        {
                            title: "Erro interno",
                            text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                        }
                    )
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/ficha/atb/rename endpoint não autorizado")
            }
        })

        routes.delete("/ficha/delete", async (req, res) => {
            if (req.headers.authorization === process.env.apiToken) {
                try {
                    const update = await services.deleteFicha(req.body)
                    if (update.status == 200) {
                        res.status(200).end()
                    }
                    else {
                        res.status(update.status).json({
                            title: update.title,
                            text: update.text
                        })
                    }
                    client.log.info("/ficha/atb/remove endpoint autorizado")
                }
                catch (err) {
                    res.status(500).json(
                        {
                            title: "Erro interno",
                            text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                        }
                    )
                    client.log.error(err, true)
                }
            }
            else {
                res.status(401).end()
                client.log.warn("/ficha/atb/remove endpoint não autorizado")
            }
        })

        return { path: '/api/v1/', router: routes }
    }
}