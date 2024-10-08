const fs = require("fs")
const path = require('path');
const toMs = require("milliseconds-parser")()
const LRU = require("@alanfilho184/kami-lru-cache").kami_cache
const { QueryTypes } = require('sequelize');

const fichas = new LRU({ maxAge: toMs.parse("2 horas"), updateAgeOnGet: true, rateOfVerifyAgedKeys: toMs.parse("10 minutos") })
const irt = new LRU({ maxAge: toMs.parse("2 horas"), updateAgeOnGet: true, rateOfVerifyAgedKeys: toMs.parse("10 minutos") })

function replaceAll(string, search, replace) {
    try { var splited = string.split(search).join(replace); }
    catch (err) { var splited = string }
    return splited
}

// module.exports = class Cache {
//     constructor(client) {
//         this.client = client

//         this.client.db.query("select * from config")
//             .then(result => {
//                 var configCache = new Map()
//                 var x = new Number()

//                 result = Array.from(result[0].entries())

//                 for (var x of result) {
//                     configCache.set(x[1].userid || x[1].serverid, {
//                         lang: replaceAll(x[1].lang, " ", ""), fPadrao: x[1].fpadrao, roll: x[1].roll, insan: x[1].insan,
//                         geral: x[1].geral, ficha: x[1].ficha, enviar: x[1].enviar
//                     })
//                 }

//                 configCache = Object.fromEntries(configCache)
//                 configCache = JSON.stringify(configCache)

//                 fs.writeFileSync(path.join(__dirname, "json", 'config.json'), configCache, { flag: "w" }, function (err) {
//                     if (err) {
//                         this.client.log.error(err, true)
//                     }
//                 })

//                 this.client.log.start("Cache de servidores e usuários")

//             })
//             .catch(err => { this.client.log.error(err, true) })

//         this.client.db.query("select * from blacklist")
//             .then(result => {
//                 var configCache = new Map()
//                 var x = new Number()

//                 result = Array.from(result[0].entries())

//                 for (var x of result) {
//                     configCache.set(x[1].userid, { bans: x[1].bans, banAtual: x[1].banatual, duracaoBan: x[1].duracaoban })
//                 }

//                 configCache = Object.fromEntries(configCache)
//                 configCache = JSON.stringify(configCache)


//                 fs.writeFileSync(path.join(__dirname, "json", 'blacklist.json'), configCache, { flag: "w" }, function (err) {
//                     if (err) {
//                         this.client.log.error(err, true)
//                     }
//                 })

//                 this.client.log.start("Blacklist de usuários")

//             })
//             .catch(err => { this.client.log.error(err, true) })

//         this.client.db.query("select * from info")
//             .then(result => {
//                 commandCount.total = result[0][0].commandcount
//                 commandCount.today = 0
//                 commandCount.buttonsTotal = result[0][0].buttoncount
//                 commandCount.buttonsToday = 0

//                 this.client.log.start("Contagem de comandos")
//             })
//             .catch(err => { this.client.log.error(err, true) })

//         this.client.db.query("select id, nomerpg from fichas")
//             .then(result => {
//                 const fichasUsers = new Object()
//                 let usuarios = new Array()


//                 for (var x of result[0]) {
//                     usuarios.push(x.id)
//                 }

//                 usuarios.forEach(u => {
//                     let fichasUser = new Array()
//                     for (var x of result[0]) {
//                         if (x.id == u) {
//                             fichasUser.push(x.nomerpg == null ? "undefined" : x.nomerpg)
//                         }
//                     }
//                     fichasUsers[u] = fichasUser
//                 })

//                 fs.writeFileSync(path.join(__dirname, "json", 'nomeFichas.json'), JSON.stringify(fichasUsers), { flag: "w" }, function (err) {
//                     if (err) {
//                         this.client.log.error(err, true)
//                     }
//                 })

//                 this.client.log.start("Cache de nome das fichas")
//             })
//             .catch(err => { this.client.log.error(err, true) })
//     }

//     get(id) {
//         var result = fs.readFileSync(path.join(__dirname, "json", `config.json`), "utf-8")
//         result = JSON.parse(result)
//         return result[id]
//     }

//     getBl(id) {
//         var result = fs.readFileSync(path.join(__dirname, "json", `blacklist.json`), "utf-8")
//         result = JSON.parse(result)

//         if (id != undefined) {
//             result = result[id]
//         }

//         return result
//     }

//     getCount() {
//         return commandCount
//     }

//     async getFicha(id, nomerpg, force = false) {
//         var ficha = fichas.get(id + nomerpg)

//         if (ficha && !force) { return ficha } else {
//             var r = await this.client.db.query(`select * from fichas where id = :id and nomerpg = :nomerpg`, {
//                 replacements: { id: id, nomerpg: nomerpg },
//             })

//             if (r[0][0]) { fichas.set(id + nomerpg, r[0][0]) }
//             return r[0][0]
//         }
//     }

//     async getIrt(id, nomerpg) {
//         const i = irt.get(id + nomerpg)
//         if (i) { return i }
//         else {
//             var r = await this.client.db.query(`select * from irt where id = '${id}' and nomerpg = '${nomerpg}'`)
//             if (r[0][0] != undefined) { irt.set(id + nomerpg, r[0]) }
//             return r[0]
//         }
//     }

//     getFichasUser(id) {
//         var result = fs.readFileSync(path.join(__dirname, "json", `nomeFichas.json`), "utf-8")
//         result = JSON.parse(result)

//         if (result[id] == undefined) {
//             return new Array()
//         }
//         else {
//             return result[id]
//         }
//     }

//     async update(id, info, local, server) {
//         let uInfo = this.get(id)

//         if (server) var dbLocal = "serverID"
//         else { dbLocal = "userID" }

//         var novo = await this.client.db.query(`select * from config where ${dbLocal} = '${id}'`)
//         novo = novo[0]

//         if (novo.length == 0) {
//             novo = true
//         } else {
//             novo = false
//         }

//         if (novo && uInfo == undefined) {
//             uInfo = new Object({
//                 lang: null,
//                 fPadrao: null,
//                 roll: null,
//                 insan: null,
//                 geral: null,
//                 ficha: null,
//                 enviar: null
//             })
//         }

//         uInfo[local] = info
//         let configCache = require("./json/config.json")

//         configCache[id] = uInfo

//         configCache = JSON.stringify(configCache)

//         fs.writeFileSync(path.join(__dirname, "json", `config.json`), configCache, function (err) {
//             if (err) {
//                 this.client.log.error(err, true)
//             }
//         })

//         if (info != null) {
//             info = `'${info}'`
//         }

//         if (novo && server) {
//             await this.client.db.query(`insert into config (serverid, lang) values('${id}', ${info})`)
//                 .catch(err => this.client.log.error(err, true))
//         }
//         else if (novo && !server) {
//             await this.client.db.query(`insert into config (userid, ${local}) values('${id}', ${info})`)
//                 .catch(err => this.client.log.error(err, true))
//         }
//         else if (!novo && server) {
//             await this.client.db.query(`update config set lang = ${info} where serverid = '${id}'`)
//                 .catch(err => this.client.log.error(err, true))
//         }
//         else {
//             await this.client.db.query(`update config set ${local} = ${info} where userid = '${id}'`)
//                 .catch(err => this.client.log.error(err, true))
//         }

//         return "atualizado"
//     }

//     async updateBl(id, info) {
//         var result = this.getBl()

//         result[id] = info

//         var configCache = JSON.stringify(result)

//         fs.writeFileSync(path.join(__dirname, "json", `blacklist.json`), configCache, function (err) {
//             if (err) {
//                 this.client.log.error(err, true)
//             }
//         })

//         var novo = await this.client.db.query(`select * from blacklist where userid = '${id}'`)
//         try { novo = novo[0][0].userid ? false : true; }
//         catch (err) { novo = true }

//         if (novo) {
//             await this.client.db.query(`insert into blacklist (userid, bans, banatual, duracaoban) values('${id}', '${info.bans}', '${info.banAtual}', '${info.duracaoBan}')`)
//                 .catch(err => this.client.log.error(err))
//         } else {
//             if (info.banAtual == null || info.duracaoBan == null) {
//                 await this.client.db.query(`update blacklist set bans = '${info.bans}', banatual = null, duracaoban = null where userid = '${id}'`)
//                     .catch(err => this.client.log.error(err))
//             }
//             else {
//                 await this.client.db.query(`update blacklist set bans = '${info.bans}', banatual = '${info.banAtual}', duracaoban = '${info.duracaoBan}' where userid = '${id}'`)
//                     .catch(err => this.client.log.error(err))
//             }
//         }
//         this.client.log.warn("Blacklist atualizada para o ID: " + id + "\nInfo adicionada:\n" + JSON.stringify(info), true)

//         this.client.emit("blacklist")

//         return "Blacklist atualizada para o ID: " + id + "\nInfo adicionada:\n" + JSON.stringify(info)
//     }

//     async updateCnt(type) {
//         if (type == "cmd") {
//             commandCount.total++
//             commandCount.today++
//             await this.client.db.query(`update info set commandcount = ${commandCount.total}`)
//         }
//         else if (type == "button") {
//             commandCount.buttonsTotal++
//             commandCount.buttonsToday++
//             await this.client.db.query(`update info set buttoncount = ${commandCount.buttonsTotal}`)
//         }
//     }

//     async updateFicha(id, nomerpg, data, config) {
//         config = {
//             ...config,
//             query: config.query || "update"
//         }

//         if (config.query == "insert") {
//             var atributos = {
//                 ...data
//             }

//             const atbTest = Object.entries(atributos)

//             atbTest.forEach((e) => {
//                 e[1] = e[1].replaceAll(" ", "").toLowerCase()
//                 if (e[1] == null || e[1] == undefined || e[1] === "" || e[1] === " " || e[1] == "undefined" || e[1] == "null" || e[1] == "excluir" || e[1] == "delete" || e[1] == "-") {
//                     delete atributos[e[0]]
//                 }
//             })

//             const senha = this.client.utils.gerarSenha()
//             const lastuse = this.client.utils.getPostgresTime()

//             await this.client.db.query(`insert into fichas (id, nomerpg, senha, lastuse, atributos) values (:id, :nomerpg, :senha, :lastuse, :atributos)`, {
//                 replacements: {
//                     id: id,
//                     nomerpg: nomerpg,
//                     senha: senha,
//                     lastuse: lastuse,
//                     atributos: JSON.stringify(atributos)
//                 },
//                 type: QueryTypes.INSERT
//             })

//             fichas.set(`${id}${nomerpg}`, { id: id, nomerpg: nomerpg, senha: senha, lastuse: lastuse, atributos: atributos })
//             this.updateFichasUser(id, nomerpg)

//             return { id: id, nomerpg: nomerpg, senha: senha, lastuse: lastuse, atributos: atributos }
//         }
//         else if (config.query == "update") {
//             config = {
//                 ...config,
//                 resetarSenha: config.resetarSenha || false,
//                 oldData: config.oldData || await this.getFicha(id, nomerpg),
//             }

//             if(!config.oldData.atributos) {
//                 config.oldData.atributos = {}
//             }

//             if (Object.entries(config.oldData.atributos).length == 0) {
//                 var oldData = await this.client.db.query("select * from fichas where id = :id and nomerpg = :nomerpg", {
//                     replacements: {
//                         id: id,
//                         nomerpg: nomerpg
//                     }
//                 })

//                 config.oldData = oldData[0][0]
//             }

//             if (config.resetarSenha) {
//                 const lastuse = this.client.utils.getPostgresTime()

//                 await this.client.db.query(`update fichas set senha = :senha, lastuse = :lastuse where id = :id and nomerpg = :nomerpg`, {
//                     replacements: {
//                         id: id,
//                         nomerpg: nomerpg,
//                         senha: config.resetarSenha,
//                         lastuse: lastuse
//                     },
//                     type: QueryTypes.UPDATE
//                 })

//                 fichas.set(`${id}${nomerpg}`, { id: id, nomerpg: nomerpg, senha: config.resetarSenha, lastuse: lastuse, atributos: config.oldData.atributos })
//                 this.updateFichasUser(id, nomerpg)

//                 return { id: id, nomerpg: nomerpg, senha: config.resetarSenha, lastuse: lastuse, atributos: config.oldData.atributos }
//             }
//             else {
//                 var atributos = {
//                     ...config.oldData.atributos,
//                     ...data
//                 }

//                 const atbTest = Object.entries(atributos)

//                 atbTest.forEach((e) => {
//                     try { e[1] = e[1].replaceAll(" ", "").toLowerCase() } catch (err) { }
//                     if (e[1] == null || e[1] == undefined || e[1] === "" || e[1] == "undefined" || e[1] == "null" || e[1] == "excluir" || e[1] == "delete" || e[1] == "-") {
//                         delete atributos[e[0]]
//                     }
//                 })

//                 const lastuse = this.client.utils.getPostgresTime()

//                 await this.client.db.query(`update fichas set atributos = :atributos, lastuse = :lastuse where id = :id and nomerpg = :nomerpg`, {
//                     replacements: {
//                         id: id,
//                         nomerpg: nomerpg,
//                         lastuse: lastuse,
//                         atributos: JSON.stringify(atributos)
//                     },
//                     type: QueryTypes.UPDATE
//                 })

//                 fichas.set(id + nomerpg, { id: id, nomerpg: nomerpg, senha: config.oldData.senha, lastuse: lastuse, atributos: atributos })

//                 return { id: id, nomerpg: nomerpg, senha: config.oldData.senha, lastuse: lastuse, atributos: atributos }
//             }
//         }
//     }

//     async modifyIrt(nomerpgNovo, infoUIRT) {
//         this.deleteIrt(infoUIRT[0].id, infoUIRT[0].nomerpg)

//         await this.client.db.query(`update irt set nomerpg = :nomerpgNovo where id = :id and nomerpg = :nomerpg`, {
//             replacements: {
//                 id: infoUIRT[0].id,
//                 nomerpg: infoUIRT[0].nomerpg,
//                 nomerpgNovo: nomerpgNovo
//             }
//         })

//         const irt = new Array()

//         infoUIRT.forEach(info => {
//             irt.push({
//                 id: info.id,
//                 nomerpg: nomerpgNovo,
//                 msgid: info.msgid,
//                 chid: info.chid,
//             })
//         })

//         return irt
//     }

//     updateFichasUser(id, nomerpg) {
//         let uInfo = this.getFichasUser(id)

//         if (!uInfo) {
//             uInfo = new Array()
//         }

//         if (!uInfo.includes(nomerpg)) { uInfo.push(nomerpg) }
//         let nomeFichasCache = require("./json/nomeFichas.json")

//         nomeFichasCache[id] = uInfo
//         nomeFichasCache = JSON.stringify(nomeFichasCache)

//         fs.writeFileSync(path.join(__dirname, "json", `nomeFichas.json`), nomeFichasCache, function (err) {
//             if (err) {
//                 this.client.log.error(err, true)
//             }
//         })
//     }

//     updateIrt(id, nomerpg, msgid, chid) {
//         var i = irt.get(id + nomerpg)

//         if (i == undefined) {
//             i = new Array()
//             i[0] = {
//                 id: id,
//                 nomerpg: nomerpg,
//                 msgid: msgid,
//                 chid: chid
//             }
//         }
//         else {
//             i[i.length] = {
//                 id: id,
//                 nomerpg: nomerpg,
//                 msgid: msgid,
//                 chid: chid
//             }
//         }

//         irt.set(id + nomerpg, i)
//     }

//     deleteFicha(id, nomerpg) {
//         fichas.delete(id + nomerpg)
//         this.deleteFichaUser(id, nomerpg)
//     }

//     deleteIrt(id, nomerpg, msgid) {
//         if (msgid) {
//             var i = irt.get(id + nomerpg)

//             var iU = new Array()
//             for (var x in i) {
//                 if (i[x].msgid != msgid) {
//                     iU.push(i[x])
//                 }
//             }

//             if (!iU[0]) {
//                 irt.delete(id + nomerpg)
//             }
//             else {
//                 irt.set(id + nomerpg, iU)
//             }
//         }
//         else {
//             irt.delete(id + nomerpg)
//         }
//     }

//     deleteFichaUser(id, nomerpg) {
//         let uInfo = this.getFichasUser(id)
//         let newUInfo = new Array()

//         uInfo.forEach((f) => {
//             if (f !== nomerpg) {
//                 newUInfo.push(f)
//             }
//         })

//         let nomeFichasCache = require("./json/nomeFichas.json")

//         nomeFichasCache[id] = newUInfo
//         nomeFichasCache = JSON.stringify(nomeFichasCache)

//         fs.writeFileSync(path.join(__dirname, "json", `nomeFichas.json`), nomeFichasCache, function (err) {
//             if (err) {
//                 this.client.log.error(err, true)
//             }
//         })
//     }

//     evalSync(arg) {
//         return eval(arg)
//     }

//     async eval(arg) {
//         return await eval(arg)
//     }

// }

const commandCount = new Object({
    cmd: 0,
    buttons: 0,
})

module.exports = class DirectDB {
    constructor(client) {
        this.client = client;
    }

    get(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.client.db.query("select * from config where userid = :id or serverid = :id", {
                    replacements: { id },
                });
                resolve(result[0][0]);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getBl(id) {
        const result = await this.client.db.query("select * from blacklist where userid = :id", {
            replacements: { id },
        });
        return result[0][0];
    }

    async getCount() {
        const result = await this.client.db.query("select commandcount, buttoncount from info");
        return {
            total: result[0][0].commandcount,
            today: commandCount.cmd,
            buttonsTotal: result[0][0].buttoncount,
            buttonsToday: commandCount.buttons,
        };
    }

    async getFicha(id, nomerpg) {
        const result = await this.client.db.query("select * from fichas where id = :id and nomerpg = :nomerpg", {
            replacements: { id, nomerpg },
        });
        return result[0][0];
    }

    async getIrt(id, nomerpg) {
        const result = await this.client.db.query("select * from irt where id = :id and nomerpg = :nomerpg", {
            replacements: { id, nomerpg },
        });
        return result[0];
    }

    async getFichasUser(id) {
        const result = await this.client.db.query("select nomerpg from fichas where id = :id", {
            replacements: { id },
        });
        return result[0].map(row => row.nomerpg);
    }

    async update(id, info, local, server) {
        const dbLocal = server ? "serverid" : "userid";
        const [result] = await this.client.db.query(`select * from config where ${dbLocal} = :id`, {
            replacements: { id },
        });

        const queryType = result.length ? "update" : "insert";
        if (queryType === "insert") {
            await this.client.db.query(`insert into config (${dbLocal}, ${local}) values(:id, :info)`, {
                replacements: { id, info },
            });
        } else {
            await this.client.db.query(`update config set ${local} = :info where ${dbLocal} = :id`, {
                replacements: { id, info },
            });
        }

        return "atualizado";
    }

    async updateBl(id, info) {
        const [result] = await this.client.db.query("select * from blacklist where userid = :id", {
            replacements: { id },
        });

        const queryType = result.length ? "update" : "insert";
        if (queryType === "insert") {
            await this.client.db.query("insert into blacklist (userid, bans, banatual, duracaoban) values(:id, :bans, :banAtual, :duracaoBan)", {
                replacements: { id, bans: info.bans, banAtual: info.banAtual, duracaoBan: info.duracaoBan },
            });
        } else {
            await this.client.db.query("update blacklist set bans = :bans, banatual = :banAtual, duracaoban = :duracaoBan where userid = :id", {
                replacements: { id, bans: info.bans, banAtual: info.banAtual, duracaoBan: info.duracaoBan },
            });
        }

        this.client.emit("blacklist");
        return `Blacklist atualizada para o ID: ${id}\nInfo adicionada:\n${JSON.stringify(info)}`;
    }

    async updateCnt(type) {
        if (type === "cmd") {
            commandCount.cmd = commandCount.cmd + 1;
            await this.client.db.query("update info set commandcount = commandcount + 1");
        } else if (type === "button") {
            commandCount.buttons = commandCount.buttons + 1;
            await this.client.db.query("update info set buttoncount = buttoncount + 1");
        }
    }

    async updateFicha(id, nomerpg, data, config) {
        config = { ...config, query: config.query || "update" };

        if (config.query === "insert") {
            const senha = this.client.utils.gerarSenha();
            const lastuse = this.client.utils.getPostgresTime();

            await this.client.db.query("insert into fichas (id, nomerpg, senha, lastuse, atributos) values (:id, :nomerpg, :senha, :lastuse, :atributos)", {
                replacements: { id, nomerpg, senha, lastuse, atributos: JSON.stringify(data) },
            });

            return { id, nomerpg, senha, lastuse, atributos: data };
        } else if (config.query === "update") {
            const oldData = config.oldData || (await this.getFicha(id, nomerpg));
            const atributos = { ...oldData.atributos, ...data };

            const lastuse = this.client.utils.getPostgresTime();

            await this.client.db.query("update fichas set atributos = :atributos, lastuse = :lastuse where id = :id and nomerpg = :nomerpg", {
                replacements: { id, nomerpg, lastuse, atributos: JSON.stringify(atributos) },
            });

            return { id, nomerpg, senha: oldData.senha, lastuse, atributos };
        }
    }

    async modifyIrt(nomerpgNovo, infoUIRT) {
        await this.client.db.query("update irt set nomerpg = :nomerpgNovo where id = :id and nomerpg = :nomerpg", {
            replacements: { id: infoUIRT[0].id, nomerpg: infoUIRT[0].nomerpg, nomerpgNovo },
        });

        return infoUIRT.map(info => ({
            id: info.id,
            nomerpg: nomerpgNovo,
            msgid: info.msgid,
            chid: info.chid,
        }));
    }

    async updateIrt(id, nomerpg, msgid, chid) {
        const i = await this.getIrt(id, nomerpg);
        if (!i) {
            await this.client.db.query("insert into irt (id, nomerpg, msgid, chid) values (:id, :nomerpg, :msgid, :chid)", {
                replacements: { id, nomerpg, msgid, chid },
            });
        } else {
            await this.client.db.query("update irt set msgid = :msgid, chid = :chid where id = :id and nomerpg = :nomerpg", {
                replacements: { id, nomerpg, msgid, chid },
            });
        }
    }

    async deleteFicha(id, nomerpg) {
        await this.client.db.query("delete from fichas where id = :id and nomerpg = :nomerpg", {
            replacements: { id, nomerpg },
        });
    }

    async deleteIrt(id, nomerpg, msgid) {
        if (msgid) {
            await this.client.db.query("delete from irt where id = :id and nomerpg = :nomerpg and msgid = :msgid", {
                replacements: { id, nomerpg, msgid },
            });
        } else {
            await this.client.db.query("delete from irt where id = :id and nomerpg = :nomerpg", {
                replacements: { id, nomerpg },
            });
        }
    }

    async eval(arg) {
        return await eval(arg);
    }

    evalSync(arg) {
        return eval(arg);
    }
};
