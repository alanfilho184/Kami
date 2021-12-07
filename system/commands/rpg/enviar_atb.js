module.exports = class enviar_atb {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "enviaratributo",
            cat: "Enviar Atributo",
            catEn: "Send Attribute",
            desc: 'Envia somente 1 atributo de uma ficha já criada.',
            descEn: 'Sends only 1 attribute of a sheet already created.',
            aliases: ["enviaratb", "sendatb", "sendatributte"],
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
    async execute(client, msg, trigger) {
        var args = client.utils.args(msg)

        if (trigger == "ficha") {
            args.reverse()
        }

        const atributosPt = client.resources["pt"].atributos
        const atributos = client.resources[msg.lang.replace("-", "")].atributos
        const atributosF = client.resources[msg.lang.replace("-", "")].atributosF
        const footer = client.resources[msg.lang.replace("-", "")].footer()

        if (!args[0]) { return msg.reply(client.tl({ local: msg.lang + "cef-nArg" })) }

        var nomeRpg = args[1]
        var atb = args[0]

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }

        try {
            var testAtb = nomeRpg.toLowerCase()
            testAtb = testAtb.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
            const r = await client.cache.getFicha(msg.author.id, nomeRpg)

            if (r[0] == "") { testAtb = client.utils.matchAtb(testAtb, atributos) }
        }
        catch (err) { }

        if (atributos.includes(testAtb)) {
            atb = testAtb
            try { nomeRpg = client.cache.get(msg.author.id).fPadrao } catch (err) { nomeRpg = undefined }
        }

        try {
            atb = client.utils.matchAtb(atb, atributos)
            if (!atributos.includes(atb)) { return msg.reply(client.tl({ local: msg.lang + "cef-atbNE", atributo: atb })) }
        }
        catch (err) { }

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

                    if (msg.lang == "en-") {
                        atb = atributosPt[atributos.indexOf(atb)]
                    }

                    if (fichaUser[atb]) {

                        var valor = fichaUser[atb]


                        atb = atributosF[atributosPt.indexOf(atb)]


                        var atributo = atb

                        const atributoEmbed = new client.Discord.MessageEmbed()
                        atributoEmbed.setColor(client.settings.color)
                        atributoEmbed.setAuthor(client.tl({ local: msg.lang + "ea-embedTi" }) + nomeRpg + `. ${client.tl({ local: msg.lang + "created" })}${msg.author.tag}`)
                        atributoEmbed.setFooter(footer, client.user.displayAvatarURL())
                        atributoEmbed.setTimestamp()

                        atributoEmbed.setTitle(atb + ":")

                        if (atributo.toLowerCase() == "imagem") {
                            atributoEmbed.setImage(valor)
                        }
                        if (atributo.toLowerCase() == "extras") {
                            atbExtras = valor

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
                                    msg.reply(client.tl({ local: msg.lang + "ef-eLE" }))
                                    break
                                }
                            }
                        }
                        if (atributo.toLowerCase() != "imagem" && atributo.toLowerCase() != "extras") {
                            atributoEmbed.setDescription(`**_${valor}_**`)
                        }
                        //atributoEmbed.setFooter(footer(msg))
                        msg.reply({ embeds: [atributoEmbed] })

                    }
                    else {
                        return msg.reply(client.tl({ local: msg.lang + "ea-atbSV", nomeRpg: nomeRpg, atb: atb }))
                    }

                }
                else {
                    return msg.reply(client.tl({ local: msg.lang + "ea-nFE", nomeRpg: nomeRpg }))
                }

            })
    }
}
