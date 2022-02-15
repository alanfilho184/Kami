function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class enviar {
    constructor() {
        return {
            ownerOnly: false,
            name: "enviar",
            fName: "Enviar",
            fNameEn: "Send",
            desc: 'Envia uma ficha já criada em forma de embed.',
            descEn: 'Sends a sheet already as a Discord\'s embed.',
            args: [
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja enviar.", type: "STRING", required: true, autocomplete: true },
            ],
            options: [
                {
                    name: "opções",
                    required: false,
                    type: "STRING",
                    desc: "Opções para o comando.",
                    choices: [
                        { name: "Ativar IRT (Atualização em tempo real).", return: "irt" }
                    ],
                }
            ],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "enviar", desc: `
            Este comando serve para receber a sua ficha como embed do Discord
        
            _Formato do comando:_
            **${"/"}enviar <nome_da_ficha>**
            
            Ex: **${"/"}enviar RPG_Kami**
            
            Para enviar uma ficha que atualiza automaticamente ao utilizar o comando /ficha, basta utlizar:
            **${"/"}enviar <nome_da_ficha> irt**
        
            Ex: **${"/"}enviar RPG_Kami irt**
        
            **Essa ainda é uma função que está em fase de testes, problemas podem ocorrer. Atualmente está limitado a 5 fichas IRT por usuário.
            Para desativar o IRT basta utilizar os botões na ficha
            `
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "send", desc: `
            This command is used to receive your sheet as a discord message. If you have only one sheet created you can use only **${"/"}send**.
        
            _Format of the command:_
            **${"/"}enviar <sheet_name>**
        
            Ex: ${"/"}enviar RPG_Kami

            To send a sheet that automatically updates when using the /sheet command, simply utlize:
            **${"/"}enviar <sheet_name> irt**
        
            Ex: **${"/"}enviar RPG_Kami irt**
        
            **This is still a function that is in testing phase, problems may occur. It is currently limited to 5 IRT sheets per user.
            To disable IRT just use the buttons on the sheet
            `


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

                var nomerpg = args.get("nome_da_ficha")
                var irtUpdt = args.get("opções")

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                if (!nomerpg) {
                    try {
                        var fichasUser = client.cache.get(int.user.id).fPadrao
                        nomerpg = fichasUser
                    }
                    catch (err) { fichasUser = undefined }

                    if (!fichasUser) {
                        const fichasUser = new Array()
                        var result = await client.db.query(`select nomerpg from fichas where id = '${int.user.id}'`)

                        for (var x in result[0]) {
                            fichasUser.push(result[0][x].nomerpg)
                        }
                        if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "efd-mFichas1", fichasUser: fichasUser })) }
                        else if (fichasUser.length == 1) { nomerpg = fichasUser[0] }
                        else { return int.editReply(client.tl({ local: int.lang + "efd-uSF" })) }
                    }
                }

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                client.cache.getFicha(int.user.id, nomerpg)
                    .then(async r => {
                        if (r) {
                            var fichaUser = r

                            for (var x in atributos) {
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
                                    const reply = this.create(client, int, nomerpg, fichaUser)
                                    const embedsArray = Object.values(reply)

                                    int.editReply({ embeds: embedsArray }).catch(err => {
                                        if (err.name + err.message.split(/\n/)[0] == "DiscordAPIErrorInvalid Form Body") {
                                            if (err.message.split(/\n/)[1] == "embeds: Embed size exceeds maximum size of 6000") {
                                                int.editReply(client.tl({ local: int.lang + "efd-fCE" }) + "\n" + client.tl({ local: int.lang + "efd-fE2" }))
                                            }
                                            else {
                                                const errs = err.message.split(/\n/)
                                                errs.shift()

                                                var errMsg = ""

                                                errs.forEach(err => {
                                                    const local = err.match(/\d+(?=])/g)
                                                    var type = err.match(/[a-z]+(?=\:)/g)
                                                    const maxSize = err.match(/[0-9]+(?= )/g)


                                                    if (int.lang == "pt-") {
                                                        if (type == "value") {
                                                            type = "valor"
                                                        }
                                                        else if (type == "name") {
                                                            type = "nome"
                                                        }
                                                    }

                                                    errMsg += client.tl({ local: int.lang + "efd-fE", cmd: [embedsArray[local[0]].fields[local[1]].name.replace(/:$/, ""), type, maxSize] }) + "\n"
                                                })

                                                int.editReply(client.tl({ local: int.lang + "efd-fCE" }) + "\n" + errMsg)
                                            }
                                        }
                                    })

                                    return
                                }
                                else if (true/*beta.has(`${int.user.id}`)*/) {
                                    if (secret) {
                                        return int.editReply(client.tl({ local: int.lang + "efd-ephIRT" }))
                                    }

                                    var infoUIRT = await client.db.query(`select nomerpg from irt where id = '${int.user.id}'`)
                                    infoUIRT = infoUIRT[0]

                                    if (infoUIRT.length >= 5) {
                                        return int.editReply(client.tl({ local: int.lang + "efd-irtMF" }))
                                    }

                                    var reply = this.create(client, int, nomerpg, fichaUser, "irtOn")
                                    const embedsArray = Object.values(reply)

                                    await int.editReply({ embeds: embedsArray })
                                        .then(m => {
                                            const bDes = new client.Discord.MessageButton()
                                                .setStyle(2)
                                                .setLabel(client.tl({ local: int.lang + "bt-desIrt" }))
                                                .setCustomId(`irt|des|id:${int.user.id}|nomerpg:${nomerpg}|msgid:${m.id}|chid:${m.channel.id}`)

                                            const bApg = new client.Discord.MessageButton()
                                                .setStyle(2)
                                                .setLabel(client.tl({ local: int.lang + "bt-apgIrt" }))
                                                .setCustomId(`irt|apg|id:${int.user.id}|nomerpg:${nomerpg}|msgid:${m.id}|chid:${m.channel.id}`)

                                            m.edit({ components: [{ type: 1, components: [bDes, bApg] }] })

                                            var irtU = {
                                                id: int.user.id,
                                                nomerpg: nomerpg,
                                                msgid: m.id,
                                                chid: m.channel.id
                                            }

                                            client.cache.updateIrt(irtU["id"], irtU["nomerpg"], irtU["msgid"], irtU["chid"])
                                            client.emit("irtStart", irtU)
                                        })
                                }
                                else {
                                    //Só utilizado se o beta estiver ativado
                                    return int.editReply(client.tl({ local: int.lang + "efd-bF" }))
                                }
                            }
                            catch (err) {
                                client.log.warn(err)
                                return int.editReply(client.tl({ local: int.lang + "efd-mMG" }))
                            }

                        }
                        else {
                            return int.editReply(client.tl({ local: int.lang + "efd-nFE", nomerpg: nomerpg }))
                        }

                    })

                    .catch(err => client.log.error(err, true))
            })

    }
    create(client, int, nomerpg, fichaUser, irt) {
        if (irt == "irtUpdt") {
            var usedInf = false
        }
        var usedS1 = false
        var usedS2 = false
        var usedS3 = false
        var usedE = false
        var usedD = false

        // int.lang = "pt-"

        const atributosS1 = client.resources["pt-"].atributosStatus
        const atributosI1 = client.resources["pt-"].atributosI1
        const atributosI2 = client.resources["pt-"].atributosI2
        const atributosS1F = client.resources[int.lang].atributosStatusF
        const atributosIF1 = client.resources[int.lang].atributosIF1
        const atributosIF2 = client.resources[int.lang].atributosIF2

        const info_perso = new client.Discord.MessageEmbed()
        info_perso.setColor(client.settings.color)
        info_perso.setAuthor({ name: client.tl({ local: int.lang + "ef-infAuthor" }) + nomerpg + `. ${client.tl({ local: int.lang + "created" })}${int.user.tag}` })
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
        status_perso.setTitle(client.tl({ local: int.lang + "ef-stpTi" }))
        extras_perso.setColor(client.settings.color)
        extras_perso.setTitle(client.tl({ local: int.lang + "ef-extPersoTi" }))

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
                info_perso.setTitle(client.tl({ local: int.lang + "ef-infoPersoTi" }))

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
                info_perso.setTitle(client.tl({ local: int.lang + "ef-infoPersoTi" }))
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
                    status_perso.setTitle(client.tl({ local: int.lang + "ef-stpTi" }))
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

            for (var x in atbs) {
                atb = atbs[x].split(":")[0]
                var val = atbs[x].split(":")[1]

                try { atb = atb.replace(" ", "") } catch (err) { }
                try { val = val.replace(/ /, '') } catch (err) { }


                if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "") {
                    extras_perso.addFields({ name: atb + ":", value: val, inline: true })
                }

                if (x == 25) {
                    let fromSite = false
                    try {
                        fromSite = int.fromSite
                    } catch (err) { }
                    if (!int.fromSite) { int.editReply(client.tl({ local: int.lang + "ef-eLE" })) }

                    break
                }
            }
            extras_perso.setTitle(client.tl({ local: int.lang + "ef-extPersoTi" }))

            usedE = true
        }

        if (fichaUser['descricao'] != "-" && fichaUser['descricao'] != "" && fichaUser['descricao'] != undefined && fichaUser['descricao'] != null) {
            desc_perso.setColor(client.settings.color)
            desc_perso.setTitle(client.tl({ local: int.lang + "ef-descPerso" }))
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
    autocomplete(client, int) {
        const options = int.options._hoistedOptions

        options.forEach(opt => {
            if (opt.name == "nome_da_ficha" && opt.focused) {
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