const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const toMs = require("milliseconds-parser")()
const LRU = require("@alanfilho184/kami-lru-cache").kami_cache

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class WebSocket {
    constructor(client) {
        const connections = new LRU({ maxAge: toMs.parse("2 minutos"), updateAgeOnGet: true })
        const sockets = new Object()

        const app = express();
        const router = express.Router()

        router.get("/ping", (req, res) => { res.status(200).end() })
        app.use("/", router)

        const httpServer = createServer(app);
        const io = new Server(httpServer, {
            cors: {
                origin: process.env.deploy == "production" ? process.env.corsAllow : "*"
            },
            pingTimeout: 10000,
            pingInterval: 15000
        });

        connections.events.on('keyAutoDelete', (key) => {
            client.log.warn(`WS sem resposta excluído: ${key}`)
            delete sockets[key]
        })

        client.on("createFichaBot", async (id, nomerpg) => {
            sockets.main.emit("update", { action: "createFichaBot", id: id, nomerpg: nomerpg })

            connections.map.forEach(async (user, socketId) => {
                user = JSON.parse(user)
                if (user.content.id == id) {
                    const socket = sockets[socketId]
                    socket.emit("createFichaBot", nomerpg)
                }
            })
        })

        client.on("deleteFichaBot", async (id, nomerpg) => {
            sockets.main.emit("update", { action: "deleteFichaBot", id: id, nomerpg: nomerpg })

            connections.map.forEach(async (user, socketId) => {
                user = JSON.parse(user)
                if (user.content.id == id) {
                    const socket = sockets[socketId]
                    socket.emit("deleteFichaBot", nomerpg)
                }
            })
        })

        client.on("updateFichaBot", async (id, nomerpg) => {
            sockets.main.emit("update", { action: "updateFichaBot", id: id, nomerpg: nomerpg })

            await sleep(3000)
            connections.map.forEach(async (user, socketId) => {
                user = JSON.parse(user)
                if (user.content.id == id && user.content.nomerpg == nomerpg) {
                    const socket = sockets[socketId]
                    socket.emit("updateFichaBot", id, nomerpg)
                }
            })
        })

        client.on("renameFichaBot", async (id, nomerpg, novonomerpg) => {
            sockets.main.emit("update", { action: "renameFichaBot", id: id, nomerpg: nomerpg, novonomerpg: novonomerpg })

            await sleep(3000)
            connections.map.forEach(async (user, socketId) => {
                user = JSON.parse(user)
                if (user.content.id == id && user.content.nomerpg == nomerpg || user.content.page == "jogador") {
                    const socket = sockets[socketId]
                    socket.emit("renameFichaBot", novonomerpg, nomerpg)
                }
            })
        })

        io.on("connection", (socket) => {
            client.log.info("Novo WS: " + socket.id)
            if (socket.handshake.query.main && socket.handshake.auth.api_key === process.env.API_TOKEN) {
                sockets.main = socket
            }
            else {
                const user = {
                    id: socket.handshake.query.id,
                    page: socket.handshake.query.page,
                    nomerpg: socket.handshake.query.nomerpg
                }

                connections.set(socket.id, user)
                sockets[socket.id] = socket

                if (user.page == "jogador") {
                    socket.on("createFichaSite", (ficha) => {
                        client.cache.updateFichasUser(ficha.id, ficha.nomerpg)

                        connections.map.forEach(async (user, socketId) => {
                            user = JSON.parse(user)
                            if (user.content.id == ficha.id && socket.id != socketId) {
                                const socket = sockets[socketId]
                                socket.emit("createFichaBot", ficha.nomerpg)
                            }
                        })
                    })
                }
                else if (user.page == "ficha") {
                    socket.on("updateFichaSite", (ficha) => {
                        client.cache.getFicha(ficha.id, ficha.nomerpg, true)
                            .then(async function () {
                                var infoUIRT = await client.cache.getIrt(ficha.id, ficha.nomerpg)

                                if (infoUIRT != "") {
                                    client.emit("updtFicha", { user: { id: ficha.id } }, { id: ficha.id, nomerpg: ficha.nomerpg, irt: infoUIRT })
                                }

                                await sleep(3000)
                                connections.map.forEach(async (user, socketId) => {
                                    user = JSON.parse(user)
                                    if (user.content.id == ficha.id && user.content.nomerpg == ficha.nomerpg && socket.id != socketId) {
                                        const socket = sockets[socketId]
                                        socket.emit("updateFichaBot", ficha.id, ficha.nomerpg)
                                    }
                                })
                            })
                    })

                    socket.on("deleteFichaSite", (ficha) => {
                        client.cache.deleteFichaUser(ficha.id, ficha.nomerpg)

                        connections.map.forEach(async (user, socketId) => {
                            user = JSON.parse(user)
                            if (user.content.id == ficha.id && socket.id != socketId && user.content.nomerpg == ficha.nomerpg || user.content.page == "jogador") {
                                const socket = sockets[socketId]
                                socket.emit("deleteFichaBot", ficha.nomerpg)
                            }
                        })
                    })

                    socket.on("renameFichaSite", (ficha) => {
                        client.cache.deleteFichaUser(ficha.id, ficha.nomerpg)
                        client.cache.updateFichasUser(ficha.id, ficha.novonomerpg)

                        connections.map.forEach(async (user, socketId) => {
                            user = JSON.parse(user)
                            if (user.content.id == ficha.id && socket.id != socketId && user.content.nomerpg == ficha.nomerpg || user.content.page == "jogador") {
                                const socket = sockets[socketId]
                                socket.emit("renameFichaBot", ficha.novonomerpg, ficha.nomerpg)
                            }
                        })
                    })
                }

                socket.on("alive", () => {
                    connections.get(socket.id)
                })
            }
        });

        httpServer.listen(process.env.PORT || 3005);
    }
}