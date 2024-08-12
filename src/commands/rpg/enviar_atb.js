module.exports = class enviar_atb {
    constructor() {
        return {
            ownerOnly: false,
            name: "enviaratributo",
            nameEn: "sendattribute",
            fName: "Enviar Atributo",
            fNameEn: "Send Attribute",
            desc: 'Envia somente 1 atributo de uma ficha já criada.',
            descEn: 'Sends only 1 attribute of a sheet already created.',
            args: [
                { name: "atributo", desc: "Atributo que deseja enviar.", type: "STRING", required: true, autocomplete: true },
                { name: "nome_da_ficha", desc: "Nome da ficha onde o atributo está.", type: "STRING", required: false, autocomplete: true },
            ],
            argsEn: [
                { name: "attribute", desc: "Attribute you want to send.", type: "STRING", required: true, autocomplete: true },
                { name: "sheet_name", desc: "Name of the sheet where the attribute is.", type: "STRING", required: false, autocomplete: true },
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
    async execute(client, int) {
        const secret = client.utils.secret(await client.cache.get(int.user.id), "enviar")
        int.deferReply({ ephemeral: secret })
            .then(async () => {
                const args = client.utils.args(int)

                const atributosPt = client.resources["pt-"].atributos
                const atributos = client.resources[int.lang].atributos
                const atributosF = client.resources[int.lang].atributosF

                var nomerpg = args.get("sheet_name")
                var atb = args.get("attribute")

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                atb = client.utils.matchAtb(atb, atributos)

                if (!nomerpg) {
                    try {
                        var fichasUser = await client.cache.get(int.user.id).fPadrao
                        nomerpg = fichasUser
                    }
                    catch (err) { fichasUser = undefined }

                    if (!fichasUser) {
                        const fichasUser = await client.cache.getFichasUser(int.user.id)

                        if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "eft-mFichas", fichasUser: fichasUser })) }
                        else if (fichasUser.length == 1) { nomerpg = fichasUser[0] }
                        else { return int.editReply(client.tl({ local: int.lang + "eft-uSF" })) }
                    }
                }

                const fichaUser = await await client.cache.getFicha(int.user.id, nomerpg)
                if (fichaUser) {
                    if (int.lang == "en-" && client.utils.isDefaultAtb(atb, atributos)) {
                        atb = atributosPt[atributos.indexOf(atb)]
                    }

                    if (fichaUser.atributos[atb]) {
                        var valor = fichaUser.atributos[atb]


                        if (client.utils.isDefaultAtb(atb, atributosPt)) {
                            atb = atributosF[atributosPt.indexOf(atb)]
                        }

                        var atributo = atb

                        const atributoEmbed = new client.Discord.EmbedBuilder()
                            .setColor(parseInt(process.env.EMBED_COLOR))
                            .setAuthor({ name: client.tl({ local: int.lang + "ea-embedTi" }) + nomerpg + `. ${client.tl({ local: int.lang + "created" })}${int.user.tag}` })
                            .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                            .setTimestamp()
                            .setTitle(atb + ":")

                        if (atributo.toLowerCase() == "imagem") {
                            atributoEmbed.setImage(valor)
                        }
                        else {
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

        options.forEach(async opt => {
            if (opt.name == "attribute" && opt.focused) {
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
            else if (opt.name == "sheet_name" && opt.focused) {
                const fichasUser = await client.cache.getFichasUser(int.user.id)

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
