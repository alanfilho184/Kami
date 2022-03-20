const logs = require("../../resources/scripts/logs")
const fs = require("fs")

module.exports = class log {
    constructor() {
        return {
            ownerOnly: true,
            name: "log",
            fName: "Log",
            desc: 'Log completo do BOT.',
            args: [],
            options: [],
            type: 1,
            run: this.execute
        }
    }

    execute(client, int) {
        async function migrate() {
                    const fichas = await client.db.query("select * from fichas");
        
                    const fichasJson = new Array()
        
                    fichas[0].forEach(f => {
                        if (f.id != "undefined         ") {
                            if (f.nomerpg != null) {
                                const ficha = {
                                    id: f.id,
                                    nomerpg: f.nomerpg,
                                    senha: f.senha
                                }
        
                                const atributos = new Object()
                                const entries = Object.entries(f)
                                entries.forEach(e => {
                                    if (e[0] != "id" && e[0] != "nomerpg" && e[0] != "senha") {
                                        if (e[1] != null) {
                                            if (e[0] == "extras") {
                                                var extras = e[1].split("|")
                                                extras.forEach(atbVal => {
                                                    try {
                                                        var atb = atbVal.split(":")[0]
                                                        var val = atbVal.split(":")[1]
        
                                                        if (val != undefined && val != null && val != "" && val != " " && val != "excluir" && val != "delete" && val != "-") {
                                                            atributos[atb] = val
                                                        }
                                                    } catch (e) { }
                                                })
                                            }
                                            else {
                                                atributos[e[0]] = e[1].replaceAll(`'`, `"`)
                                            }
                                        }
                                    }
                                })
        
                                ficha.atributos = atributos
                                fichasJson.push(ficha)
                            }
                        }
                    });
        
                    var queryString = `insert into fichasjson (id, nomerpg, senha, lastuse, atributos) values `
                    var atributosString = ""
        
                    const timeNow = time.now().setZone('America/Sao_Paulo').toSQL({ includeZone: true });
        
                    var x = 0
                    fichasJson.forEach(f => {
                        atributosString += `('${f.id}', '${f.nomerpg}', '${f.senha}', '${timeNow}', '${JSON.stringify(f.atributos)}')`
                        if (x < fichasJson.length - 1) {
                            atributosString += ","
                        }
                        x++
                    })
        
                    client.db.query(queryString + atributosString)
                }
                migrate()
        return
        int.deferReply({ ephemeral: true })
            .then(() => {
                fs.writeFileSync("log.txt", logs.logTxt())
                int.editReply({ content: "Aqui está o log de hoje:", files: ["log.txt"] })
            })
    }
}
