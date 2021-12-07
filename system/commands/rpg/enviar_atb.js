module.exports = class enviar_atb {
    constructor() {
        return {
            ownerOnly: false,
            name: "enviaratributo",
            fName: "Enviar Atributo",
            fNameEn: "Send Attribute",
            desc: 'Envia somente 1 atributo de uma ficha já criada.',
            descEn: 'Sends only 1 attribute of a sheet already created.',
            args: [
                { name: "atributo", desc: "Atributo que deseja enviar.", type: "STRING", required: true },
                { name: "nome_da_ficha", desc: "Nome da ficha onde o atributo está.", type: "STRING", required: false },
            ],
            options: [],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "enviaratributo", desc: `
            Este comando serve para receber somente um atributo da sua ficha em forma de embed do Discord
        
            _Formato do comando:_
            **${"/"}enviaratributo <atributo> <nome_da_ficha>**
            
            Ex: **${"/"}enviaratributo sanidade RPG_Kami**`
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "enviaratributo", desc: `
            This command is used to receive only one attribute from your sheet as a Discord embed
        
            _Format of the command:_
            **${"/"}enviaratributo <attribute> <sheet_name>**
            
            Ex: **${"/"}enviaratributo sanity RPG_Kami**`
            },
            run: this.execute
        }
    }
    execute(client, int) {
        int.deferReply()
            .then(async () => {
                var args = client.utils.args(int)

                const atributosPt = client.resources["pt"].atributos
                const atributos = client.resources[int.lang.replace("-", "")].atributos
                const atributosF = client.resources[int.lang.replace("-", "")].atributosF
                const footer = client.resources[int.lang.replace("-", "")].footer()

                if (args.size == 0) { return int.editReply(client.tl({ local: int.lang + "cef-nArg" })) }

                var nomeRpg = args.get("nome_da_ficha")
                var atb = args.get("atributo")

                try { nomeRpg = nomeRpg.replace("'", '') } catch { }

                try {
                    var testAtb = nomeRpg.toLowerCase()
                    testAtb = testAtb.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
                    const r = await client.cache.getFicha(int.user.id, nomeRpg)

                    if (r[0] == "") { testAtb = client.utils.matchAtb(testAtb, atributos) }
                }
                catch (err) { }

                if (atributos.includes(testAtb)) {
                    atb = testAtb
                    try { nomeRpg = client.cache.get(int.user.id).fPadrao } catch (err) { nomeRpg = undefined }
                }

                try {
                    atb = client.utils.matchAtb(atb, atributos)
                    if (!atributos.includes(atb)) { return int.editReply(client.tl({ local: int.lang + "cef-atbNE", atributo: atb })) }
                }
                catch (err) { }

                if (!nomeRpg) {
                    try {
                        var fichasUser = client.cache.get(int.user.id).fPadrao
                        nomeRpg = fichasUser
                    }
                    catch (err) { fichasUser = undefined }

                    if (!fichasUser) {
                        const fichasUser = new Array()
                        var result = await client.db.query(`select nomerpg from fichas where id = '${int.user.id}'`)

                        for (x in result[0]) {
                            fichasUser.push(result[0][x].nomerpg)
                        }
                        if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "eft-mFichas", fichasUser: fichasUser })) }
                        else if (fichasUser.length == 1) { nomeRpg = fichasUser[0] }
                        else { return int.editReply(client.tl({ local: int.lang + "eft-uSF" })) }
                    }
                }

                try { nomeRpg = nomeRpg.replace("'", '') } catch { }

                client.cache.getFicha(int.user.id, nomeRpg)
                    .then(async r => {
                        if (r) {
                            var fichaUser = r

                            if (int.lang == "en-") {
                                atb = atributosPt[atributos.indexOf(atb)]
                            }

                            if (fichaUser[atb]) {

                                var valor = fichaUser[atb]

                                atb = atributosF[atributosPt.indexOf(atb)]

                                var atributo = atb

                                const atributoEmbed = new client.Discord.MessageEmbed()
                                atributoEmbed.setColor(client.settings.color)
                                atributoEmbed.setAuthor(client.tl({ local: int.lang + "ea-embedTi" }) + nomeRpg + `. ${client.tl({ local: int.lang + "created" })}${int.user.tag}`)
                                atributoEmbed.setFooter(footer, client.user.displayAvatarURL())
                                atributoEmbed.setTimestamp()

                                atributoEmbed.setTitle(atb + ":")

                                if (atributo.toLowerCase() == "imagem") {
                                    atributoEmbed.setImage(valor)
                                }
                                if (atributo.toLowerCase() == "extras") {
                                    var atbExtras = valor

                                    atbs = atbExtras.split("|")

                                    for (x in atbs) {
                                        atb = atbs[x].split(":")[0]
                                        val = atbs[x].split(":")[1]

                                        try { atb = atb.replace(" ", "") } catch { }
                                        try { val = val.replace(/ .$/, '') } catch { }
                                        try { val = val.replace(/ (.+)/, '') } catch { }

                                        if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "") {
                                            atributoEmbed.addFields({ name: atb + ":", value: val, inline: true })
                                        }
                                        else { }

                                        if (x == 25) {
                                            int.editReply(client.tl({ local: int.lang + "ef-eLE" }))
                                            break
                                        }
                                    }
                                }
                                if (atributo.toLowerCase() != "imagem" && atributo.toLowerCase() != "extras") {
                                    atributoEmbed.setDescription(`**_${valor}_**`)
                                }

                                int.editReply({ embeds: [atributoEmbed] })

                            }
                            else {
                                return int.editReply(client.tl({ local: int.lang + "ea-atbSV", nomeRpg: nomeRpg, atb: atb }))
                            }

                        }
                        else {
                            return int.editReply(client.tl({ local: int.lang + "ea-nFE", nomeRpg: nomeRpg }))
                        }

                    })
            })
    }
}