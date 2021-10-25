function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class enviar {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "enviar",
            cat: "Enviar",
            catEn: "Send",
            desc: 'Envia uma ficha já criada em forma de embed.',
            descEn: 'Sends a sheet already as a Discord\'s embed.',
            aliases: ["send"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "$prefix$" + "enviar", desc: `
            Este comando serve para receber a sua ficha como embed do Discord
        
            _Formato do comando:_
            **${"$prefix$"}enviar <nome_da_ficha>**
            
            Ex: **${"$prefix$"}enviar RPG_Kami**
            
            Para enviar uma ficha que atualiza automaticamente ao utilizar o comando $prefix$ficha, basta utlizar:
            **${"$prefix$"}enviar <nome_da_ficha> irt**
        
            Ex: **${"$prefix$"}enviar RPG_Kami irt**
        
            **Essa ainda é uma função que está em fase de testes, problemas podem ocorrer. Atualmente está limitado a 5 fichas IRT por usuário.
            Para desativar o IRT basta utilizar os botões na ficha ou utilizar **$prefix$apagar <nome_da_ficha> irt**
            `
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "$prefix$" + "send", desc: `
            This command is used to receive your sheet as a discord message. If you have only one sheet created you can use only **${"$prefix$"}send**.
        
            _Format of the command:_
            **${"$prefix$"}send <sheet_name>**
        
            Ex: ${"$prefix$"}send RPG_Kami

            To send a sheet that automatically updates when using the $prefix$sheet command, simply utlize:
            **${"$prefix$"}send <sheet_name> irt**
        
            Ex: **${"$prefix$"}send RPG_Kami irt**
        
            **This is still a function that is in testing phase, problems may occur. It is currently limited to 5 IRT sheets per user.
            To disable IRT just use the buttons on the sheet or use **prefix$delete <sheet_name> irt**.
            `


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
        var irtUpdt = args[1]

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }

        try {
            if (nomeRpg.toLowerCase() == "irt") {
                nomeRpg = undefined
                irtUpdt = "irt"
            }
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
                if (fichasUser.length > 1) { return msg.reply(client.tl({ local: msg.lang + "efd-mFichas1", fichasUser: fichasUser })) }
                else if (fichasUser.length == 1) { nomeRpg = fichasUser[0] }
                else { return msg.reply(client.tl({ local: msg.lang + "efd-uSF" })) }
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


                    try { irtUpdt = irtUpdt.toLowerCase() } catch (err) { }

                    try {
                        if (irtUpdt != "irt") {
                            const reply = this.create(client, msg, nomeRpg, fichaUser)
                            const embedsArray = Object.values(reply)

                            msg.reply({ embeds: embedsArray }).catch(err => {
                                if (err.name + err.message.split(/\n/)[0] == "DiscordAPIErrorInvalid Form Body") {
                                    if (err.message.split(/\n/)[1] == "embeds: Embed size exceeds maximum size of 6000") {
                                        if (msg.slash) {
                                            msg.editReply(client.tl({ local: msg.lang + "efd-fCE" }) + "\n" + client.tl({ local: msg.lang + "efd-fE2" }))
                                        }
                                        else {
                                            msg.reply(client.tl({ local: msg.lang + "efd-fCE" }) + "\n" + client.tl({ local: msg.lang + "efd-fE2" }))
                                        }
                                    }
                                    else {
                                        const errs = err.message.split(/\n/)
                                        errs.shift()

                                        var errMsg = ""

                                        errs.forEach(err => {
                                            const local = err.match(/\d+(?=])/g)
                                            var type = err.match(/[a-z]+(?=\:)/g)
                                            const maxSize = err.match(/[0-9]+(?= )/g)


                                            if (msg.lang == "pt-") {
                                                if (type == "value") {
                                                    type = "valor"
                                                }
                                                else if (type == "name") {
                                                    type = "nome"
                                                }
                                            }

                                            errMsg += client.tl({ local: msg.lang + "efd-fE", cmd: [embedsArray[local[0]].fields[local[1]].name.replace(/:$/, ""), type, maxSize] }) + "\n"
                                        })


                                        if (msg.slash) {
                                            msg.editReply(client.tl({ local: msg.lang + "efd-fCE" }) + "\n" + errMsg)
                                        }
                                        else {
                                            msg.reply(client.tl({ local: msg.lang + "efd-fCE" }) + "\n" + errMsg)
                                        }
                                    }
                                }

                            })

                            return
                        }
                        else if (true/*beta.has(`${msg.author.id}`)*/) {
                            var infoUIRT = await client.db.query(`select nomerpg from irt where id = '${msg.author.id}'`)
                            infoUIRT = infoUIRT[0]

                            if (infoUIRT.length >= 5) {
                                return msg.reply(client.tl({ local: msg.lang + "efd-irtMF" }))
                            }

                            var reply = this.create(client, msg, nomeRpg, fichaUser, "irtOn")
                            const embedsArray = Object.values(reply)

                            await msg.reply({ embeds: embedsArray })
                                .then(m => {
                                    const bDes = new client.Discord.MessageButton()
                                        .setStyle(2)
                                        .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                                        .setCustomId(`irt|des|id:${msg.author.id}|nomerpg:${nomeRpg}|msgid:${m.id}|chid:${m.channel.id}`)

                                    const bApg = new client.Discord.MessageButton()
                                        .setStyle(2)
                                        .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                                        .setCustomId(`irt|apg|id:${msg.author.id}|nomerpg:${nomeRpg}|msgid:${m.id}|chid:${m.channel.id}`)



                                    m.edit({ components: [{ type: 1, components: [bDes, bApg] }] })

                                    var irtU = {
                                        id: msg.author.id,
                                        nomeRpg: nomeRpg,
                                        msgid: m.id,
                                        chid: m.channel.id
                                    }

                                    client.cache.updateIrt(irtU["id"], irtU["nomeRpg"], irtU["msgid"], irtU["chid"])
                                    client.emit("irtStart", irtU)
                                })

                        }
                        else {
                            //Só utilizado se o beta estiver ativado
                            return msg.reply(client.tl({ local: msg.lang + "efd-bF" }))
                        }
                    }
                    catch (err) {
                        client.log.warn(err)
                        return msg.reply(client.tl({ local: msg.lang + "efd-mMG" }))
                    }

                }
                else {
                    return msg.reply(client.tl({ local: msg.lang + "efd-nFE", nomeRpg: nomeRpg }))
                }

            })

            .catch(err => client.log.error(err, true))

    }
    create(client, msg, nomeRpg, fichaUser, irt) {
        if (irt == "irtUpdt") {
            var usedInf = false
        }
        var usedS1 = false
        var usedS2 = false
        var usedS3 = false
        var usedE = false
        var usedD = false

        // msg.lang = "pt-"

        const atributosS1 = client.resources["pt"].atributosStatus
        const atributosI1 = client.resources["pt"].atributosI1
        const atributosI2 = client.resources["pt"].atributosI2
        const atributosS1F = client.resources[msg.lang.replace("-", "")].atributosStatusF
        const atributosIF1 = client.resources[msg.lang.replace("-", "")].atributosIF1
        const atributosIF2 = client.resources[msg.lang.replace("-", "")].atributosIF2

        const info_perso = new client.Discord.MessageEmbed()
        info_perso.setColor(client.settings.color)
        info_perso.setAuthor(client.tl({ local: msg.lang + "ef-infAuthor" }) + nomeRpg + `. ${client.tl({ local: msg.lang + "created" })}${msg.author.tag}`)
        info_perso.setThumbnail(fichaUser["imagem"])
        const status_perso = new client.Discord.MessageEmbed()
        const status_perso2 = new client.Discord.MessageEmbed()
        const status_perso3 = new client.Discord.MessageEmbed()
        const desc_perso = new client.Discord.MessageEmbed()
        const extras_perso = new client.Discord.MessageEmbed()

        status_perso.setColor(client.settings.color)
        status_perso2.setColor(client.settings.color)
        status_perso3.setColor(client.settings.color)
        desc_perso.setColor(client.settings.color)
        status_perso.setTitle(client.tl({ local: msg.lang + "ef-stpTi" }))
        extras_perso.setColor(client.settings.color)
        extras_perso.setTitle(client.tl({ local: msg.lang + "ef-extPersoTi" }))

        status_perso.setTitle("Embed ainda não utilizado")
        status_perso2.setTitle("Embed ainda não utilizado")
        status_perso3.setTitle("Embed ainda não utilizado")
        extras_perso.setTitle("Embed ainda não utilizado")
        desc_perso.setTitle("Embed ainda não utilizado")

        for (var z in atributosI1) {
            var atb = atributosI1[z]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "" && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                var valor = fichaUser[atb]
                atb = atributosIF1[z]
                info_perso.addFields({ name: `${atb}:`, value: `${valor}`, inline: true })
                info_perso.setTitle(client.tl({ local: msg.lang + "ef-infoPersoTi" }))
                //info_perso.setFooter(footer(msg))

                if (irt == "irtUpdt") {
                    usedInf = true
                }
            }
        }

        for (var y in atributosI2) {
            var atb = atributosI2[y]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "" && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                var valor = fichaUser[atb]
                atb = atributosIF2[y]
                info_perso.addFields({ name: `${atb}:`, value: `${valor}` })
                info_perso.setTitle(client.tl({ local: msg.lang + "ef-infoPersoTi" }))
            }
        }

        var fields = 1
        for (var x in atributosS1) {
            var atb = atributosS1[x]
            if (fichaUser[atb] != "-" && fichaUser[atb] != "" && fichaUser[atb] != undefined && fichaUser[atb] != null) {
                if (fields <= 24) {
                    var valor = fichaUser[atb]
                    atb = atributosS1F[x]
                    status_perso.addFields({ name: `${atb}:`, value: `${valor}`, inline: true })
                    status_perso.setTitle(client.tl({ local: msg.lang + "ef-stpTi" }))
                    usedS1 = true
                }
                if (fields > 24 && fields <= 48) {
                    var valor = fichaUser[atb]
                    atb = atributosS1F[x]
                    status_perso2.addFields({ name: `${atb}:`, value: `${valor}`, inline: true })
                    status_perso2.setTitle("\u200b")
                    usedS2 = true
                }
                if (fields > 48 && fields <= 72) {
                    var valor = fichaUser[atb]
                    atb = atributosS1F[x]
                    status_perso3.addFields({ name: `${atb}:`, value: `${valor}`, inline: true })
                    status_perso3.setTitle("\u200b")
                    usedS3 = true
                }
                fields += 1
            }
        }
        if (fichaUser['extras'] != "-" && fichaUser['extras'] != "" && fichaUser['extras'] != undefined && fichaUser['extras'] != null) {
            var atbExtras = fichaUser['extras']

            var atbs = atbExtras.split("|")

            for (x in atbs) {
                atb = atbs[x].split(":")[0]
                var val = atbs[x].split(":")[1]

                try { atb = atb.replace(" ", "") } catch (err) { }
                try { val = val.replace(/ /, '') } catch (err) { }


                if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "") {
                    extras_perso.addFields({ name: atb + ":", value: val, inline: true })
                }

                if (x == 25) {
                    msg.reply(client.tl({ local: msg.lang + "ef-eLE" }))
                    break
                }
            }
            extras_perso.setTitle(client.tl({ local: msg.lang + "ef-extPersoTi" }))

            usedE = true
        }

        if (fichaUser['descricao'] != "-" && fichaUser['descricao'] != "" && fichaUser['descricao'] != undefined && fichaUser['descricao'] != null) {
            desc_perso.setColor(client.settings.color)
            desc_perso.setTitle(client.tl({ local: msg.lang + "ef-descPerso" }))
            desc_perso.setDescription(`${fichaUser['descricao']}`)
            usedD = true
        }

        var reply = new Object()

        if (irt != "irtUpdt") {
            reply["Inf"] = info_perso
        }
        else if (usedInf == true) {
            reply["Inf"] = info_perso
        }

        if (usedS1 == true) {
            reply["S1"] = status_perso
        }

        if (usedS2 == true) {
            reply["S2"] = status_perso2
        }

        if (usedS3 == true) {
            reply["S3"] = status_perso3
        }
        if (usedE == true) {
            reply["Ext"] = extras_perso
        }

        if (usedD == true) {
            reply["Descr"] = desc_perso
        }

        return reply

    }
}