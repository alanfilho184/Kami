const axios = require('axios');

module.exports = class API {
    constructor(client) {
        this.client = client
    }

    postBotinfo() {
        axios.post(`${process.env.apiUrl}/botinfo`, this.client.botStatus.api(), {
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                this.client.log.info({ Info: `Botinfo postada`, Response: response.data })
            })
            .catch(error => {
                this.client.log.error(error)
            })
    }

    postCommands() {
        const comandos = new Object()

        this.client.commands.map(c => {
            if (!c.ownerOnly) {
                if (c.name != "buttonroll") {
                    comandos[c.name] = {
                        name: c.name,
                        description: c.desc,
                        cat: c.fName,
                        help: c.helpPt,
                        type: c.type,
                    }
                }
            }
        })

        axios.post(`${process.env.apiUrl}/comandos`, comandos, {
            headers: {
                "Authorization": process.env.apiToken,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                this.client.log.info({ Info: `Comandos postados`, Response: response.data })
            })
            .catch(error => {
                this.client.log.error(error)
            })
    }
}