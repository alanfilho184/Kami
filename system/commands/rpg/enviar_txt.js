const fs = require("fs")

const br = (str, limit) => {
    let brokenString = '';
    for (let i = 0, count = 0; i < str.length; i++) {
        if (count >= limit && str[i] === ' ') {
            count = 0;
            brokenString += '\n';
        } else {
            count++;
            brokenString += str[i];
        }
    }
    return brokenString;
}

module.exports = class enviar_txt {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                user: [],
                owner: false,
            },
            name: "enviartxt",
            cat: "Enviar TXT",
            catEn: "Send TXT",
            desc: 'Envia a ficha como um arquivo .txt.',
            descEn: 'Sends a sheet as a .txt file.',
            aliases: ["sendtxt"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "enviartxt", desc: `Este comando serve para receber a sua ficha como um arquivo .txt
        
            _Formato do comando:_
            **${"/"}enviartxt <nome_da_ficha>**
            
            Ex: **${"/"}enviartxt RPG_Kami**`
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "enviartxt", desc: `This command is used to receive your sheet as a .txt file
        
            _Format of the command:_
            **${"/"}enviartxt <sheet_name>**
            
            Ex: **${"/"}enviartxt RPG_Kami**`
            },
            run: this.execute,
            create: this.create
        }
    }
    async execute(client, msg) {
        const args = client.utils.args(msg)

        const atributos = client.resources[msg.lang.replace("-", "")].atributos

        const beta = client.whitelist.get("beta")
        const premium = client.whitelist.get("premium")

        var nomeRpg = args[0]

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }

        if (!nomeRpg) {
            try {
                var fichasUser = client.cache.get(msg.author.id).fPadrao
                nomeRpg = fichasUser
            }
            catch (err) { fichasUser = undefined }

            if (!fichasUser) {
                const fichasUser = new Array()
                var result = await client.db.query(`select nomerpg from fichas where id = '${msg.author.id}'`)

                for (x in result[0]) {
                    fichasUser.push(result[0][x].nomerpg)
                }
                if (fichasUser.length > 1) { return msg.reply(client.tl({ local: msg.lang + "eft-mFichas", fichasUser: fichasUser })) }
                else if (fichasUser.length == 1) { nomeRpg = fichasUser[0] }
                else { return msg.reply(client.tl({ local: msg.lang + "eft-uSF" })) }
            }

        }

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }

        client.cache.getFicha(msg.author.id, nomeRpg)
            .then(async r => {
                if (r) {
                    var fichaUser = r

                    for (x in atributos) {
                        if (fichaUser[atributos[x]] == undefined) {
                            fichaUser[atributos[x]] = "-"
                        }
                    }

                    if (fichaUser["imagem"] == "-" || fichaUser["imagem"] == null) {
                        fichaUser["imagem"] = ""
                    }

                    var fichaTXT = this.create(client, msg, nomeRpg, fichaUser)
                    fs.writeFile(client.tl({ local: msg.lang + "eft-fN" }) + nomeRpg + "-" + msg.author.id + '.txt', fichaTXT, function (err) {
                        if (err) throw err;
                    })

                    var txt = `${client.tl({ local: msg.lang + "eft-fN" })}${nomeRpg + "-" + msg.author.id}.txt`
                    msg.reply({ content: `${client.tl({ local: msg.lang + "eft-pEF" })}\n`, files: [txt] })
                        .then(() => {
                            fs.unlink(client.tl({ local: msg.lang + "eft-fN" }) + nomeRpg + "-" + msg.author.id + '.txt', function (err) {
                                if (err) throw err;
                            })
                        })
                }
                else {
                    return msg.reply(client.tl({ local: msg.lang + "eft-nFE", nomeRpg: nomeRpg }))
                }

            })
    }
    create(client, msg, nomeRpg, fichaUser) {
        const atributosS1 = client.resources["pt"].atributosStatus
        const atributosI1 = client.resources["pt"].atributosI1
        const atributosI2 = client.resources["pt"].atributosI2
        const atributosS1F = client.resources[msg.lang.replace("-", "")].atributosStatusF
        const atributosIF1 = client.resources[msg.lang.replace("-", "")].atributosIF1
        const atributosIF2 = client.resources[msg.lang.replace("-", "")].atributosIF2

        var fichaTXT = client.tl({ local: msg.lang + "txt-h1" })

        var z;
        var atb
        for (z in atributosI1) {
            atb = atributosI1[z]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "- " && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                var valor = fichaUser[atb]
                atb = atributosIF1[z]
                fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
            }
        }

        var y;
        for (y in atributosI2) {
            atb = atributosI2[y]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "- " && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                valor = fichaUser[atb]
                atb = atributosIF2[y]
                fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
            }
        }

        fichaTXT += client.tl({ local: msg.lang + "txt-h2" })

        var x;
        var fields = 1
        for (x in atributosS1) {
            atb = atributosS1[x]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "- " && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                if (fields <= 24) {
                    valor = fichaUser[atb]
                    atb = atributosS1F[x]
                    fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
                }
                if (fields > 24 && fields <= 48) {
                    valor = fichaUser[atb]
                    atb = atributosS1F[x]
                    fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
                }
                if (fields > 48 && fields <= 72) {
                    valor = fichaUser[atb]
                    atb = atributosS1F[x]
                    fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
                }
                fields += 1
            }
        }
        if (fichaUser['extras'] != "-" && fichaUser['extras'] != "- " && fichaUser['extras'] != undefined && fichaUser['extras'] != null && fichaUser['extras'] != "") {
            fichaTXT += client.tl({ local: msg.lang + "txt-h3" })
            var atbExtras = fichaUser['extras']

            var atbs = atbExtras.split("|")

            for (x in atbs) {
                var atb = atbs[x].split(":")[0]
                var val = atbs[x].split(":")[1]

                atb = atb.replace(" ", "")
                val = val.replace(/ /, '')



                if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "") {
                    fichaTXT += br(`${atb}: ` + `${val}`, 90) + "\n"
                }
                else { }
            }

        }

        if (fichaUser['descricao'] != "-" && fichaUser['descricao'] != "- " && fichaUser['descricao'] != undefined && fichaUser['descricao'] != null) {
            fichaTXT += client.tl({ local: msg.lang + "txt-h4" })
            fichaTXT += `${br(fichaUser['descricao'], 90)}`
        }

        return fichaTXT
    }
}