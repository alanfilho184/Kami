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
            ownerOnly: false,
            name: "enviartxt",
            nameEn: "sendtxt",
            fName: "Enviar TXT",
            fNameEn: "Send TXT",
            desc: 'Envia a ficha como um arquivo .txt.',
            descEn: 'Sends a sheet as a .txt file.',
            args: [
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja enviar.", type: "STRING", required: true, autocomplete: true },
            ],
            argsEn: [
                { name: "sheet_name", desc: "Name of the sheet you want to send.", type: "STRING", required: true, autocomplete: true },
            ],
            options: [],
            type: 1,
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
            create: this.create,
            autocomplete: this.autocomplete

        }
    }
    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "enviar")
        int.deferReply({ ephemeral: secret })
            .then(async () => {
                const args = client.utils.args(int)

                const atributos = client.resources[int.lang].atributos

                const beta = client.whitelist.get("beta")
                const premium = client.whitelist.get("premium")

                var nomerpg = args.get("sheet_name")

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                if (!nomerpg) {
                    try {
                        var fichasUser = client.cache.get(int.user.id).fPadrao
                        nomerpg = fichasUser
                    }
                    catch (err) { fichasUser = undefined }

                    if (!fichasUser) {
                        const fichasUser = client.cache.getFichasUser(int.user.id)

                        if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "eft-mFichas", fichasUser: fichasUser })) }
                        else if (fichasUser.length == 1) { nomerpg = fichasUser[0] }
                        else { return int.editReply(client.tl({ local: int.lang + "eft-uSF" })) }
                    }

                }

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                client.cache.getFicha(int.user.id, nomerpg)
                    .then(async r => {
                        if (r) {
                            var fichaUser = r.atributos

                            var fichaTXT = this.create(client, int, fichaUser)
                            fs.writeFile(client.tl({ local: int.lang + "eft-fN" }) + nomerpg + "-" + int.user.id + '.txt', fichaTXT, function (err) {
                                if (err) throw err;
                            })

                            var txt = `${client.tl({ local: int.lang + "eft-fN" })}${nomerpg + "-" + int.user.id}.txt`
                            int.editReply({ content: `${client.tl({ local: int.lang + "eft-pEF" })}\n`, files: [txt] })
                                .then(() => {
                                    fs.unlink(client.tl({ local: int.lang + "eft-fN" }) + nomerpg + "-" + int.user.id + '.txt', function (err) {
                                        if (err) throw err;
                                    })
                                })
                        }
                        else {
                            return int.editReply(client.tl({ local: int.lang + "eft-nFE", nomerpg: nomerpg }))
                        }

                    })
            })
    }
    create(client, int, fichaUser) {
        const atributosS1 = client.resources["pt-"].atributosStatus
        const atributosI1 = client.resources["pt-"].atributosI1
        const atributosI2 = client.resources["pt-"].atributosI2
        const atributosS1F = client.resources[int.lang].atributosStatusF
        const atributosIF1 = client.resources[int.lang].atributosIF1
        const atributosIF2 = client.resources[int.lang].atributosIF2

        var fichaTXT = client.tl({ local: int.lang + "txt-h1" })

        var z;
        var atb
        for (var z in atributosI1) {
            atb = atributosI1[z]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "- " && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                var valor = fichaUser[atb]
                delete fichaUser[atb]

                atb = atributosIF1[z]
                fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
            }
        }

        var y;
        for (var y in atributosI2) {
            atb = atributosI2[y]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "- " && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                valor = fichaUser[atb]
                delete fichaUser[atb]

                atb = atributosIF2[y]
                fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
            }
        }

        fichaTXT += client.tl({ local: int.lang + "txt-h2" })

        for (var x in atributosS1) {
            atb = atributosS1[x]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "- " && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                valor = fichaUser[atb]
                delete fichaUser[atb]

                atb = atributosS1F[x]
                fichaTXT += br(`${atb}: ` + `${valor}`, 90) + "\n"
            }
        }

        for (var x of Object.keys(fichaUser)) {
            if (fichaUser[x] != undefined && x != "descricao") {
                fichaTXT += br(`${x}: ` + `${fichaUser[x]}`, 90) + "\n"

                delete fichaUser[x]
            }
        }

        if (fichaUser['descricao'] != "-" && fichaUser['descricao'] != "- " && fichaUser['descricao'] != undefined && fichaUser['descricao'] != null) {
            fichaTXT += client.tl({ local: int.lang + "txt-h4" })
            fichaTXT += `${br(fichaUser['descricao'], 90)}`
        }

        return fichaTXT
    }
    autocomplete(client, int) {
        const options = int.options._hoistedOptions

        options.forEach(opt => {
            if (opt.name == "sheet_name" && opt.focused) {
                const fichasUser = client.cache.getFichasUser(int.user.id)

                if (fichasUser.length >= 1) {
                    const find = client.utils.matchNomeFicha(opt.value, fichasUser)
                    const data = new Array()

                    find.forEach(f => {
                        data.push({ name: f, value: f })
                    })

                    int.respond(data)
                }
            }
        })
    }
}