function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

module.exports = class ajuda {
    constructor() {
        return {
            ownerOnly: false,
            name: "ajuda",
            fName: "Ajuda",
            fNameEn: "Help",
            desc: 'Mostra uma lista completa com os comandos do BOT.',
            descEn: 'Show a complete list with the BOT\'s commands.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "ajuda", desc: `Esse comando mostra uma lista com todos os outros comandos do BOT
                
                Ex: **${"/"}ajuda**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "ajuda", desc: `This command shows a list with all the others commands of the BOT
            
                Ex: **${"/"}ajuda**`
            },
            run: this.execute
        }
    }

    async execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "geral")
        await int.deferReply({ ephemeral: secret })

        const mainHelp = new client.Discord.MessageEmbed()
            .setTitle(client.tl({ local: int.lang + "ajuda-tMain" }))
            .setColor(client.settings.color)
            .setDescription(client.tl({ local: int.lang + "ajuda-main" }))
            .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
            .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
            .setTimestamp()

        const bTermos = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "ajuda-btTermos" }))
            .setURL(`https://kamisite.herokuapp.com/${int.lang == "pt-" ? "termos" : "terms"}/`)

        const bPrivacidade = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "ajuda-btPrivacidade" }))
            .setURL(`https://kamisite.herokuapp.com/${int.lang == "pt-" ? "privacidade" : "privacy"}/`)

        const bSup = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "botI-f2V" }))
            .setURL("https://kamisite.herokuapp.com/suporte")

        var repeat = true
        await int.editReply({ embeds: [mainHelp], components: [{ type: 1, components: [bTermos, bPrivacidade, bSup] }] })

        var help = mainHelp
        var choice = ""

        while (repeat) {
            const uniqueID = `helpMenu|${Date.now()}`
            const menu = new client.Discord.MessageSelectMenu()
                .setCustomId(uniqueID)
                .setPlaceholder(client.tl({ local: int.lang + "ajuda-mPH" }))

            if (choice != "" && choice != "inicio") { menu.addOptions({ label: int.lang == "pt-" ? "Inicio" : "Home", value: "inicio", description: int.lang == "pt-" ? "Volta para página inicial." : "Go back to homepage." }) }
            if (choice != "atributos") { menu.addOptions({ label: int.lang == "pt-" ? "Atributos" : "Attributes", value: "atributos", description: int.lang == "pt-" ? "Lista todos os atributos." : "List all attributes." }) }

            client.commands.forEach(cmd => {
                if (cmd.ownerOnly) { return }
                if (cmd.name == choice) { return }

                if (int.lang == "pt-") {
                    menu.addOptions({ label: cmd.fName, value: cmd.name, description: cmd.desc })
                }
                else {
                    menu.addOptions({ label: cmd.fNameEn, value: cmd.name, description: cmd.descEn })
                }
            })

            var botmsg = await int.editReply({ embeds: [help], components: [{ type: 1, components: [bTermos, bPrivacidade, bSup] }, { type: 1, components: [menu] }] })

            if (!int.inGuild()) { botmsg = await client.channels.fetch(int.channelId) }

            var filter = (interaction) => interaction.user.id === int.user.id && interaction.customId === uniqueID
            await botmsg.awaitMessageComponent({ filter, time: 120000 })
                .then(async interaction => {
                    interaction.deferUpdate()

                    choice = interaction.values[0]

                    try {
                        const cmd = client.commands.get(interaction.values[0])

                        if (int.lang == "pt-") {

                            help = new client.Discord.MessageEmbed()
                                .setTitle(replaceAll(cmd.helpPt.title, "$prefix$", client.prefix))
                                .setColor(client.settings.color)
                                .setDescription(replaceAll(cmd.helpPt.desc, "$prefix$", client.prefix))
                                .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                                .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
                                .setTimestamp()
                            return

                        }
                        else {
                            help = new client.Discord.MessageEmbed()
                                .setTitle(replaceAll(cmd.helpEn.title, "$prefix$", client.prefix))
                                .setColor(client.settings.color)
                                .setDescription(replaceAll(cmd.helpEn.desc, "$prefix$", client.prefix))
                                .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                                .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
                                .setTimestamp()
                            return
                        }
                    }
                    catch {
                        if (interaction.values[0] == "atributos") {
                            const atributos = client.resources[int.lang].atributos

                            if (int.lang == "en-") {
                                var atributosF = "Attributes:"
                            }
                            else {
                                var atributosF = "Atributos:"
                            }

                            for (var x in atributos) {
                                if (x < atributos.length - 1) {
                                    atributosF += " " + atributos[x] + ","
                                }
                                if (x == atributos.length - 1) {
                                    atributosF += " " + atributos[x]
                                }
                            }

                            help = new client.Discord.MessageEmbed()
                                .setDescription("**" + atributosF + "**" + client.tl({ local: int.lang + "ajuda-atributos" }))
                                .setColor(client.settings.color)
                                .setTitle("<:fichaAjuda:766790214550814770> " + client.tl({ local: int.lang + "ajuda-tAtributos" }))
                                .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                                .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
                                .setTimestamp()

                            return
                        }
                        else if (interaction.values[0] == "inicio") {
                            help = mainHelp
                            return
                        }
                    }
                })
                .catch(err => {
                    if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                        int.editReply({ content: null, components: [{ type: 1, components: [bTermos, bSup] }] })
                    }
                    else {
                        client.log.error(err, true)
                    }

                    repeat = false
                    return
                })
        }
    }
}
