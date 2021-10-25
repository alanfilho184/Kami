const beta = new Set()
const premium = new Set()

module.exports = class Whitelist {
    constructor(client) {

        this.client = client

        this.client.db.query(`select id from beta`)
            .then(result => {
                result[0].forEach(betaUser => {
                    beta.add(betaUser.id)
                })
                this.client.log.start("Usuários da beta setados")
            })
            .catch(err => this.client.log.error(err, true))

        this.client.db.query(`select id from premium`)
            .then(result => {
                result[0].forEach(premiumUser => {
                    premium.add(premiumUser.id)
                })
                this.client.log.start("Usuários do premium setados")
            })
            .catch(err => this.client.log.error(err, true))
    }

    get(local) {
        switch (local) {
            case "beta":
                return beta
            case "premium":
                return premium
            default:
                return "Local não especificado ou incorreto"
        }
    }

    async add(local, user) {
        switch (local) {
            case "beta":
                var userInfo = await this.client.users.fetch(user).catch(err => {
                    if (err == "DiscordAPIError: Unknown User") { return undefined }
                    else { this.client.log.error(err, true) }
                })
                if (!userInfo) {
                    return "ID: " + user + " inválido"
                }

                if (beta.has(user)) { return "Usuário: " + userInfo.tag + " já está na beta" }

                await this.client.db.query(`insert into beta (id) values ('${user}')`)
                    .catch(err => {
                        if (`${err}`.startsWith("Error: ER_DUP_ENTRY: Duplicate entry")) {
                            return "Usuário: " + userInfo.tag + " já está na beta"
                        }
                        else {
                            this.client.log.error(err, true)
                        }
                    })

                beta.add(`${user}`)
                return "Usuário: `" + userInfo.tag + "` adicionado a beta"

            case "premium":
                var userInfo = await this.client.users.fetch(user).catch(err => {
                    if (err == "DiscordAPIError: Unknown User") return undefined
                    else { this.client.log.error(err, true) }
                })
                if (!userInfo) {
                    return "ID: " + user + " inválido"
                }

                if (premium.has(user)) { return "Usuário: " + userInfo.tag + " já está no premium" }

                await this.client.db.query(`insert into premium (id) values ('${user}')`)
                    .catch(err => {
                        if (`${err}`.startsWith("Error: ER_DUP_ENTRY: Duplicate entry")) {
                            return "Usuário: " + userInfo.tag + " já está no premium"
                        }
                        else {
                            this.client.log.error(err, true)
                        }
                    })

                premium.add(`${user}`)
                return "Usuário: `" + userInfo.tag + "` adicionado ao premium"

            default:
                return "Local não especificado ou incorreto"
        }
    }

    async remove(local, user) {
        switch (local) {
            case "beta":
                if (!beta.has(user)) {
                    return "ID: " + user + " não está na beta"
                }

                await this.client.db.query(`delete from beta where id = '${user}'`)

                var userInfo = await this.client.users.fetch(user).catch(err => {
                    if (err == "DiscordAPIError: Unknown User") { return { tag: undefined } }
                    else { this.client.log.error(err, true) }
                })

                beta.delete(`${user}`)

                return "Usuário: `" + userInfo.tag + "` removido da beta"

            case "premium":
                if (!premium.has(user)) {
                    return "ID: " + user + " não está no premium"
                }

                var userInfo = await this.client.users.fetch(user).catch(err => {
                    if (err == "DiscordAPIError: Unknown User") { return { tag: undefined } }
                    else { this.client.log.error(err, true) }
                })

                await this.client.db.query(`delete from premium where id = '${user}'`)

                premium.delete(`${user}`)

                return "Usuário: `" + userInfo.tag + "` removido do premium"
        }

    }
}