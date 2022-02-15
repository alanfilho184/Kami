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
                { name: "atributo", desc: "Atributo que deseja enviar.", type: "STRING", required: true, autocomplete: true },
                { name: "nome_da_ficha", desc: "Nome da ficha onde o atributo está.", type: "STRING", required: false, autocomplete: true },
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
            run: this.execute,
            autocomplete: this.autocomplete
        }
    }
    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "enviar")
        int.deferReply({ephemeral: secret})
            .then(async () => {
                const args = client.utils.args(int)

                const atributosPt = client.resources["pt-"].atributos
                const atributos = client.resources[int.lang].atributos
                const atributosF = client.resources[int.lang].atributosF

                var nomerpg = args.get("nome_da_ficha")
                var atb = args.get("atributo")

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                atb = client.utils.matchAtb(atb, atributos)
                if (!atributos.includes(atb)) { return int.editReply(client.tl({ local: int.lang + "cef-atbNE", atributo: atb })) }

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
                        if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "eft-mFichas", fichasUser: fichasUser })) }
                        else if (fichasUser.length == 1) { nomerpg = fichasUser[0] }
                        else { return int.editReply(client.tl({ local: int.lang + "eft-uSF" })) }
                    }
                }

                const fichaUser = await client.cache.getFicha(int.user.id, nomerpg)
                if (fichaUser) {
                    if (int.lang == "en-") {
                        atb = atributosPt[atributos.indexOf(atb)]
                    }

                    if (fichaUser[atb]) {
                        var valor = fichaUser[atb]

                        atb = atributosF[atributosPt.indexOf(atb)]

                        var atributo = atb

                        const atributoEmbed = new client.Discord.MessageEmbed()
                            .setColor(client.settings.color)
                            .setAuthor({name: client.tl({ local: int.lang + "ea-embedTi" }) + nomerpg + `. ${client.tl({ local: int.lang + "created" })}${int.user.tag}`})
                            .setFooter({text: client.resources.footer(), iconURL: client.user.displayAvatarURL()})
                            .setTimestamp()
                            .setTitle(atb + ":")

                        if (atributo.toLowerCase() == "imagem") {
                            atributoEmbed.setImage(valor)
                        }
                        if (atributo.toLowerCase() == "extras") {
                            var atbExtras = valor

                            var atbs = atbExtras.split("|")

                            for (var x in atbs) {
                                var atb = atbs[x].split(":")[0]
                                var val = atbs[x].split(":")[1]

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
                        return int.editReply(client.tl({ local: int.lang + "ea-atbSV", nomerpg: nomerpg, atb: atb }))
                    }
                }
                else {
                    return int.editReply(client.tl({ local: int.lang + "ea-nFE", nomerpg: nomerpg }))
                }

            })

    }
    autocomplete(client, int) {
        const options = int.options._hoistedOptions
        const atributos = client.resources[int.lang].atributos
        const atributosF = client.resources[int.lang].atributosF

        options.forEach(opt => {
            if (opt.name == "atributo" && opt.focused) {
                const find = client.utils.matchAtbAutocomplete(opt.value, atributos)
                const data = new Array()

                find.forEach(f => {
                    let index = client.utils.indexOf(atributos, f)

                    if (index[0] != undefined) {
                        data.push({ name: atributosF[index], value: atributos[index] })
                    }
                })

                if (data.length > 0) {
                    int.respond(data)
                }
            }
            else if (opt.name == "nome_da_ficha" && opt.focused) {
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
