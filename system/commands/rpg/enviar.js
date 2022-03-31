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

                const beta = client.whitelist.get("beta")

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
                        const fichasUser = client.cache.getFichasUser(int.user.id)

                        if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "efd-mFichas1", fichasUser: fichasUser })) }
                        else if (fichasUser.length == 1) { nomerpg = fichasUser[0] }
                        else { return int.editReply(client.tl({ local: int.lang + "efd-uSF" })) }
                    }
                }

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                client.cache.getFicha(int.user.id, nomerpg)
                    .then(async fichaUser => {
                        if (fichaUser) {
                            if (fichaUser.atributos["imagem"] == "-" || fichaUser.atributos["imagem"] == null) {
                                fichaUser.atributos["imagem"] = ""
                            }

                            try { irtUpdt = irtUpdt.toLowerCase() } catch (err) { }

                            try {
                                if (irtUpdt != "irt") {
                                    const reply = this.create(client, int, fichaUser)
                                    const embedsArray = Object.values(reply)

                                    int.editReply({ embeds: reply }).catch(err => {
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

                                    var infoUIRT = await client.db.query(`select nomerpg from irt where id = :id`, {
                                        replacements: { id: int.user.id },
                                    })
                                    infoUIRT = infoUIRT[0]

                                    if (infoUIRT.length >= 5) {
                                        return int.editReply(client.tl({ local: int.lang + "efd-irtMF" }))
                                    }

                                    var reply = this.create(client, int, fichaUser)

                                    await int.editReply({ embeds: reply })
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
    create(client, int, fichaUser, irt) {
        var reply = Object({
            inf: false,
            s1: false,
            s2: false,
            s3: false,
            desc: false
        })

        const { atributosI1, atributosIF1, atributosI2, atributosIF2, atributosStatus, atributosStatusF } = client.resources[int.lang]

        const infEmbed = new client.Discord.MessageEmbed()
            .setColor(client.settings.color)
            .setTitle(client.tl({ local: int.lang + "ef-infAuthor" }) + fichaUser.nomerpg + `. ${client.tl({ local: int.lang + "created" })}${int.user.tag}`)
            .setAuthor({ name: "Clique aqui para visualizar esta ficha no site do Kami", url: `https://kamisite.herokuapp.com/ficha/${fichaUser.id}/${fichaUser.nomerpg}` })
            .setThumbnail(fichaUser.atributos.imagem ? fichaUser.atributos.imagem : "")

        delete fichaUser.atributos["imagem"]

        const s1Embed = new client.Discord.MessageEmbed().setColor(client.settings.color), s2Embed = new client.Discord.MessageEmbed().setColor(client.settings.color)
        const s3Embed = new client.Discord.MessageEmbed().setColor(client.settings.color), descEmbed = new client.Discord.MessageEmbed().setColor(client.settings.color)

        for (var x of atributosI1) {
            if (fichaUser.atributos[x] != undefined) {
                infEmbed.addField(atributosIF1[atributosI1.indexOf(x)], fichaUser.atributos[x], true)
                delete fichaUser.atributos[x]
            }
        }

        for (var x of atributosI2) {
            if (fichaUser.atributos[x] != undefined) {
                infEmbed.addField(atributosIF2[atributosI2.indexOf(x)], fichaUser.atributos[x], false)
                delete fichaUser.atributos[x]
            }
        }

        var fields = 0
        for (var x of atributosStatus) {
            if (fichaUser.atributos[x] != undefined) {
                if (fields <= 25) {
                    s1Embed.addField(atributosStatusF[atributosStatus.indexOf(x)], fichaUser.atributos[x], true)
                }
                else if (fields > 25 && fields <= 50) {
                    s2Embed.addField(atributosStatusF[atributosStatus.indexOf(x)], fichaUser.atributos[x], true)
                }
                else if (fields > 50 && fields <= 75) {
                    s3Embed.addField(atributosStatusF[atributosStatus.indexOf(x)], fichaUser.atributos[x], true)
                }

                delete fichaUser.atributos[x]
                fields += 1
            }
        }

        if (fichaUser.atributos.descricao != undefined) {
            if (fichaUser.atributos.descricao != "") {
                descEmbed.setDescription(fichaUser.atributos.descricao)
                delete fichaUser.atributos.descricao
            }
        }

        for (var x of Object.keys(fichaUser.atributos)) {
            if (fichaUser.atributos[x] != undefined) {
                if (fields <= 25) {
                    s1Embed.addField(x, fichaUser.atributos[x], true)
                }
                else if (fields > 25 && fields <= 50) {
                    s2Embed.addField(x, fichaUser.atributos[x], true)
                }
                else if (fields > 50 && fields <= 75) {
                    s3Embed.addField(x, fichaUser.atributos[x], true)
                }

                delete fichaUser.atributos[x]
                fields += 1
            }
        }

        reply.inf = infEmbed
        reply.s1 = s1Embed.fields.length > 0 ? s1Embed.setTitle(client.tl({ local: int.lang + "ef-stpTi" })) : false
        reply.s2 = s2Embed.fields.length > 0 ? s2Embed : false
        reply.s3 = s3Embed.fields.length > 0 ? s3Embed : false
        reply.desc = descEmbed.description ? descEmbed.setTitle(client.tl({ local: int.lang + "ef-descPerso" })) : false

        const replyArray = new Array
        Object.values(reply).forEach((val) => {
            if (val) {
                replyArray.push(val)
            }
        })
        reply = replyArray

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