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

        const mainHelp = new client.Discord.EmbedBuilder()
            .setTitle(client.tl({ local: int.lang + "ajuda-tMain" }))
            .setColor(parseInt(process.env.EMBED_COLOR))
            .setDescription(client.tl({ local: int.lang + "ajuda-main" }))
            .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
            .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
            .setTimestamp()

        const bTermos = new client.Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "ajuda-btTermos" }))
            .setURL(`https://kamiapp.com.br/${int.lang == "pt-" ? "termos" : "terms"}/`)

        const bPrivacidade = new client.Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "ajuda-btPrivacidade" }))
            .setURL(`https://kamiapp.com.br/${int.lang == "pt-" ? "privacidade" : "privacy"}/`)

        const bSup = new client.Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "botI-f2V" }))
            .setURL("https://kamiapp.com.br/suporte")

        const uniqueID = Date.now()
        var menuDisplayed = 0

        const bMenu = new client.Discord.ButtonBuilder()
            .setStyle(1)
            .setLabel(client.tl({ local: int.lang + "ajuda-pLista" }))
            .setCustomId(`bMenu|${uniqueID}`)

        var repeat = true
        await int.editReply({ embeds: [mainHelp], components: [{ type: 1, components: [bTermos, bPrivacidade, bSup] }] })

        var help = mainHelp
        var choice = ""

        while (repeat) {
            const menu = new client.Discord.SelectMenuBuilder()
                .setCustomId(`helpMenu|${uniqueID}`)
                .setPlaceholder(client.tl({ local: int.lang + "ajuda-mPH" }))

            if (choice != "" && choice != "inicio") { menu.addOptions({ label: int.lang == "pt-" ? "Inicio" : "Home", value: "inicio", description: int.lang == "pt-" ? "Volta para página inicial." : "Go back to homepage." }) }

            const commands = client.commands.filter(c => !c.ownerOnly && c.name != choice).map(c => c)

            if (commands.length >= 20) {
                const half = Math.floor(commands.length / 2)

                if (menuDisplayed == 0) {
                    for (let i = 0; i < half; i++) {
                        const cmd = commands[i]

                        if (cmd.ownerOnly) { return }
                        if (cmd.name == choice) { return }

                        if (int.lang == "pt-") {
                            menu.addOptions({ label: cmd.fName, value: cmd.name, description: cmd.desc })
                        }
                        else {
                            menu.addOptions({ label: cmd.fNameEn, value: cmd.name, description: cmd.descEn })
                        }
                    }
                }
                else {
                    for (let i = half; i < commands.length; i++) {
                        const cmd = commands[i]

                        if (cmd.ownerOnly) { return }
                        if (cmd.name == choice) { return }

                        if (int.lang == "pt-") {
                            menu.addOptions({ label: cmd.fName, value: cmd.name, description: cmd.desc })
                        }
                        else {
                            menu.addOptions({ label: cmd.fNameEn, value: cmd.name, description: cmd.descEn })
                        }
                    }
                }
            }

            var botmsg = await int.editReply({ embeds: [help], components: [{ type: 1, components: [bTermos, bPrivacidade, bSup] }, { type: 1, components: [menu] }, { type: 1, components: [bMenu] }] })

            if (!int.inGuild()) { botmsg = await client.channels.fetch(int.channelId) }

            var filter = (interaction) => interaction.user.id === int.user.id && interaction.customId.split("|")[1] === uniqueID.toString()
            await botmsg.awaitMessageComponent({ filter, time: 120000 })
                .then(async interaction => {
                    const toDo = interaction.customId.split("|")[0]
                    interaction.deferUpdate()

                    if (toDo == "helpMenu") {
                        choice = interaction.values[0]
                        try {
                            const cmd = client.commands.get(interaction.values[0])

                            if (int.lang == "pt-") {

                                help = new client.Discord.EmbedBuilder()
                                    .setTitle(replaceAll(cmd.helpPt.title, "$prefix$", client.prefix))
                                    .setColor(parseInt(process.env.EMBED_COLOR))
                                    .setDescription(replaceAll(cmd.helpPt.desc, "$prefix$", client.prefix))
                                    .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                                    .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
                                    .setTimestamp()
                                return

                            }
                            else {
                                help = new client.Discord.EmbedBuilder()
                                    .setTitle(replaceAll(cmd.helpEn.title, "$prefix$", client.prefix))
                                    .setColor(parseInt(process.env.EMBED_COLOR))
                                    .setDescription(replaceAll(cmd.helpEn.desc, "$prefix$", client.prefix))
                                    .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                                    .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
                                    .setTimestamp()
                                return
                            }
                        }
                        catch {
                            if (interaction.values[0] == "inicio") {
                                help = mainHelp
                                return
                            }
                        }
                    }
                    else if (toDo == "bMenu") {
                        if (menuDisplayed == 0) {
                            bMenu.setLabel(client.tl({ local: int.lang + "ajuda-aLista" }))
                            menuDisplayed = 1
                        }
                        else {
                            bMenu.setLabel(client.tl({ local: int.lang + "ajuda-pLista" }))
                            menuDisplayed = 0
                        }
                    }
                })
                .catch(err => {
                    if (err.code == "InteractionCollectorError") {
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
