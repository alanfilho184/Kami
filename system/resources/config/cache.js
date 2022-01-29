const fs = require("fs")
const path = require('path');
const toMs = require("milliseconds-parser")()
const LRU = require("./lru")
const { QueryTypes } = require('sequelize');

const fichas = new LRU({ maxAge: toMs.parse("2 horas"), updateAgeOnGet: true })
const irt = new LRU({ maxAge: toMs.parse("2 horas"), updateAgeOnGet: true })

function replaceAll(string, search, replace) {
    try { var splited = string.split(search).join(replace); }
    catch (err) { var splited = string }
    return splited
}

const commandCount = new Object()

module.exports = class Cache {
    constructor(client) {
        this.client = client

        this.client.db.query("select * from config")
            .then(result => {
                var configCache = new Map()
                var x = new Number()

                result = Array.from(result[0].entries())

                for (var x of result) {
                    configCache.set(x[1].userid || x[1].serverid, {
                        lang: replaceAll(x[1].lang, " ", ""), fPadrao: x[1].fpadrao, roll: x[1].roll, insan: x[1].insan,
                        geral: x[1].geral, ficha: x[1].ficha, enviar: x[1].enviar
                    })
                }

                configCache = Object.fromEntries(configCache)
                configCache = JSON.stringify(configCache)

                fs.writeFileSync(path.join(__dirname, "json", 'config.json'), configCache, { flag: "w" }, function (err) {
                    if (err) {
                        this.client.log.error(err, true)
                    }
                })

                this.client.log.start("Cache de servidores e usuários")

            })
            .catch(err => this.client.log.error(err, true))


        this.client.db.query("select * from blacklist")
            .then(result => {
                var configCache = new Map()
                var x = new Number()

                result = Array.from(result[0].entries())

                for (var x of result) {
                    configCache.set(x[1].userid, { bans: x[1].bans, banAtual: x[1].banatual, duracaoBan: x[1].duracaoban })
                }

                configCache = Object.fromEntries(configCache)
                configCache = JSON.stringify(configCache)


                fs.writeFileSync(path.join(__dirname, "json", 'blacklist.json'), configCache, { flag: "w" }, function (err) {
                    if (err) {
                        this.client.log.error(err, true)
                    }
                })

                this.client.log.start("Blacklist de usuários")

            })
            .catch(err => { this.client.log.error(err, true) })

        this.client.db.query("select * from info")
            .then(result => {
                commandCount.total = result[0][0].commandcount
                commandCount.today = 0
                commandCount.buttonsTotal = result[0][0].buttoncount
                commandCount.buttonsToday = 0

                this.client.log.start("Contagem de comandos")
            })
            .catch(err => { this.client.log.error(err, true) })

        this.client.db.query("select id, nomerpg from fichas")
            .then(result => {
                const fichasUsers = new Object()
                let usuarios = new Array()


                for (var x of result[0]) {
                    usuarios.push(x.id)
                }

                usuarios.forEach(u => {
                    let fichasUser = new Array()
                    for (var x of result[0]) {
                        if (x.id == u) {
                            fichasUser.push(x.nomerpg == null ? "undefined" : x.nomerpg)
                        }
                    }
                    fichasUsers[u] = fichasUser
                })

                fs.writeFileSync(path.join(__dirname, "json", 'nomeFichas.json'), JSON.stringify(fichasUsers), { flag: "w" }, function (err) {
                    if (err) {
                        this.client.log.error(err, true)
                    }
                })

                this.client.log.start("Cache de nome das fichas")
            })
    }

    get(id) {
        var result = fs.readFileSync(path.join(__dirname, "json", `config.json`), "utf-8")
        result = JSON.parse(result)
        return result[id]
    }

    getBl(id) {
        var result = fs.readFileSync(path.join(__dirname, "json", `blacklist.json`), "utf-8")
        result = JSON.parse(result)

        if (id != undefined) {
            result = result[id]
        }

        return result
    }

    getCount() {
        return commandCount
    }

    async getFicha(id, nomeRpg) {
        var ficha = fichas.get(id + nomeRpg)
        if (ficha) { return ficha } else {
            var r = await this.client.db.query(`select * from fichas where id = '${id}' and nomerpg = '${nomeRpg}'`)

            if (r[0][0]) { fichas.set(id + nomeRpg, r[0][0]) }
            return r[0][0]
        }
    }

    async getIrt(id, nomeRpg) {
        const i = irt.get(id + nomeRpg)
        if (i) { return i }
        else {
            var r = await this.client.db.query(`select * from irt where id = '${id}' and nomerpg = '${nomeRpg}'`)
            if (r[0][0] != undefined) { irt.set(id + nomeRpg, r[0]) }
            return r[0]
        }
    }

    getFichasUser(id) {
        var result = fs.readFileSync(path.join(__dirname, "json", `nomeFichas.json`), "utf-8")
        result = JSON.parse(result)
        return result[id]
    }

    async update(id, info, local, server) {
        let uInfo = this.get(id)

        if (server) var dbLocal = "serverID"
        else { dbLocal = "userID" }

        var novo = await this.client.db.query(`select * from config where ${dbLocal} = '${id}'`)
        novo = novo[0]

        if (novo.length == 0) {
            novo = true
        } else {
            novo = false
        }

        if (novo && uInfo == undefined) {
            uInfo = new Object({
                lang: null,
                fPadrao: null,
                roll: null,
                insan: null,
                geral: null,
                ficha: null,
                enviar: null
            })
        }

        uInfo[local] = info
        let configCache = require("./json/config.json")

        configCache[id] = uInfo

        configCache = JSON.stringify(configCache)

        fs.writeFileSync(path.join(__dirname, "json", `config.json`), configCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        if (info != null) {
            info = `'${info}'`
        }

        if (novo && server) {
            await this.client.db.query(`insert into config (serverid, lang) values('${id}', ${info})`)
                .catch(err => this.client.log.error(err, true))
        }
        else if (novo && !server) {
            await this.client.db.query(`insert into config (userid, ${local}) values('${id}', ${info})`)
                .catch(err => this.client.log.error(err, true))
        }
        else if (!novo && server) {
            await this.client.db.query(`update config set lang = ${info} where serverid = '${id}'`)
                .catch(err => this.client.log.error(err, true))
        }
        else {
            await this.client.db.query(`update config set ${local} = ${info} where userid = '${id}'`)
                .catch(err => this.client.log.error(err, true))
        }

        return "atualizado"
    }

    async updateBl(id, info) {
        var result = this.getBl()

        result[id] = info

        var configCache = JSON.stringify(result)

        fs.writeFileSync(path.join(__dirname, "json", `blacklist.json`), configCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })

        var novo = await this.client.db.query(`select * from blacklist where userid = '${id}'`)
        novo = novo[0]

        if (novo) {
            await this.client.db.query(`insert into blacklist (userid, bans, banatual, duracaoban) values('${id}', '${info.bans}', '${info.banAtual}', '${info.duracaoBan}')`)
                .catch(err => this.client.log.error(err))
        } else {
            if (info.banAtual == null || info.duracaoBan == null) {
                await this.client.db.query(`update blacklist set bans = '${info.bans}', banatual = null, duracaoban = null where userid = '${id}'`)
                    .catch(err => this.client.log.error(err))
            }
            else {
                await this.client.db.query(`update blacklist set bans = '${info.bans}', banatual = '${info.banAtual}', duracaoban = '${info.duracaoBan}' where userid = '${id}'`)
                    .catch(err => this.client.log.error(err))
            }
        }
        this.client.log.warn("Blacklist atualizada para o ID: " + id + "\nInfo adicionada:\n" + JSON.stringify(info), true)

        this.client.emit("blacklist")

        return "Blacklist atualizada para o ID: " + id + "\nInfo adicionada:\n" + JSON.stringify(info)
    }

    async updateCnt(type) {
        if (type == "cmd") {
            commandCount.total++
            commandCount.today++
            await this.client.db.query(`update info set commandcount = ${commandCount.total}`)
        }
        else if (type == "button") {
            commandCount.buttonsTotal++
            commandCount.buttonsToday++
            await this.client.db.query(`update info set buttoncount = ${commandCount.buttonsTotal}`)
        }
    }

    async updateFicha(id, nomeRpg, atb, valor, custom_sql) {
        if (custom_sql) {
            this.client.db.query(custom_sql)
                .then(r => {
                    if (fichas.has(id + nomeRpg)) {
                        var f = fichas.get(id + nomeRpg)
                        for (var x in atb) {
                            f[atb[x]] = valor[x]
                        }
                        fichas.set(id + nomeRpg, f)
                        return r[0]
                    } else {
                        this.client.db.query(`select * from fichas where id = '${id}' and nomerpg = '${nomeRpg}'`)
                            .then(r => { fichas.set(id + nomeRpg, r[0][0]); return r[0] })
                    }
                })
        }
        else {
            if (valor == null) {
                await this.client.db.query(`update fichas set ${atb} = null where id = '${id}' and nomerpg = '${nomeRpg}'`)
                    .then(r => {
                        if (fichas.has(id + nomeRpg)) {
                            var f = fichas.get(id + nomeRpg)
                            f[atb] = valor
                            fichas.set(id + nomeRpg, f)
                            return r[0]
                        } else {
                            this.client.db.query(`select * from fichas where id = '${id}' and nomerpg = '${nomeRpg}'`)
                                .then(r => { fichas.set(id + nomeRpg, r[0][0]); return r[0] })
                        }
                    })
            }
            else {
                await this.client.db.query(`update fichas set ${atb} = :valor where id = '${id}' and nomerpg = '${nomeRpg}'`, {
                    replacements: { valor: valor },
                    type: QueryTypes.UPDATE
                })
                    .then(r => {
                        if (fichas.has(id + nomeRpg)) {
                            var f = fichas.get(id + nomeRpg)
                            f[atb] = valor
                            fichas.set(id + nomeRpg, f)
                            return r[0]
                        } else {
                            this.client.db.query(`select * from fichas where id = '${id}' and nomerpg = '${nomeRpg}'`)
                                .then(r => { fichas.set(id + nomeRpg, r[0][0]); return r[0] })
                        }
                    })
            }
        }
    }

    updateFichasUser(id, nomeRpg) {
        let uInfo = this.getFichaUser(id)

        if (!uInfo) {
            uInfo =  new Array() 
        }

        uInfo.push(nomeRpg)
        let nomeFichasCache = require("./json/nomeFichas.json")

        nomeFichasCache[id] = uInfo

        nomeFichasCache = JSON.stringify(nomeFichasCache)

        fs.writeFileSync(path.join(__dirname, "json", `nomeFichas.json`), nomeFichasCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })
    }

    updateIrt(id, nomeRpg, msgid, chid) {
        var i = irt.get(id + nomeRpg)

        if (i == undefined) {
            i = new Array()
            i[0] = {
                id: id,
                nomerpg: nomeRpg,
                msgid: msgid,
                chid: chid
            }
        }
        else {
            i[i.length] = {
                id: id,
                nomerpg: nomeRpg,
                msgid: msgid,
                chid: chid
            }
        }

        irt.set(id + nomeRpg, i)
    }

    deleteFicha(id, nomeRpg) {
        fichas.delete(id + nomeRpg)
        this.deleteFichaUser(id, nomeRpg)
    }

    deleteIrt(id, nomeRpg, msgid) {
        if (msgid) {
            var i = irt.get(id + nomeRpg)

            var iU = new Array()
            for (var x in i) {
                if (i[x].msgid != msgid) {
                    iU.push(i[x])
                }
            }

            if (!iU[0]) {
                irt.delete(id + nomeRpg)
            }
            else {
                irt.set(id + nomeRpg, iU)
            }
        }
        else {
            irt.delete(id + nomeRpg)
        }
    }

    deleteFichaUser(id, nomeRpg){
        let uInfo = this.getFichaUser(id)
        uInfo.remove(nomeRpg)

        let nomeFichasCache = require("./json/nomeFichas.json")

        nomeFichasCache[id] = uInfo
        nomeFichasCache = JSON.stringify(nomeFichasCache)

        fs.writeFileSync(path.join(__dirname, "json", `nomeFichas.json`), nomeFichasCache, function (err) {
            if (err) {
                this.client.log.error(err, true)
            }
        })
    }

    evalSync(arg) {
        return eval(arg)
    }

    async eval(arg) {
        return await eval(arg)
    }

}