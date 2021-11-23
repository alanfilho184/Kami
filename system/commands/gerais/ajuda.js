function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

module.exports = class ajuda {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "ajuda",
            cat: "Ajuda",
            catEn: "Help",
            desc: 'Mostra uma lista completa com os comandos do BOT.',
            descEn: 'Show a complete list with the BOT\'s commands.',
            aliases: ["help", "comandos", "commands", "atributos", "attributes", "socorro", "sos"],
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

    async execute(client, msg) {

        const footer = client.resources[msg.lang.replace("-", "")].footer

        const mainHelp = new client.Discord.MessageEmbed()
            .setTitle(client.tl({ local: msg.lang + "ajuda-tMain" }))
            .setColor(client.settings.color)
            .setDescription(client.tl({ local: msg.lang + "ajuda-main" }))
            .setFooter(footer(), client.user.displayAvatarURL())
            .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
            .setTimestamp()

        const bTermos = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "ajuda-btTermos" }))
            .setURL(`https://kamibot.vercel.app/short/termos/${msg.lang.replace("-", "")}`)

        const bSup = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "botI-f2V" }))
            .setURL("https://discord.com/invite/9rqCkFB")

        var repeat = true
        var botFmsg = await msg.reply({ embeds: [mainHelp], components: [{ type: 1, components: [bTermos, bSup] }] })
        var botmsg = ""

        var help = mainHelp
        var choice = ""

        while (repeat) {

            const uniqueID = `helpMenu|${Date.now()}`
            const menu = new client.Discord.MessageSelectMenu()
                .setCustomId(uniqueID)
                .setPlaceholder(client.tl({ local: msg.lang + "ajuda-mPH" }))

            if (choice != "") { menu.addOptions({ label: msg.lang == "pt-" ? "Inicio" : "Home", value: "inicio", description: msg.lang == "pt-" ? "Volta para página inicial." : "Go back to homepage." }) }
            if (choice != "atributos") { menu.addOptions({ label: msg.lang == "pt-" ? "Atributos" : "Attributes", value: "atributos", description: msg.lang == "pt-" ? "Lista todos os atributos." : "List all attributes." }) }

            client.commands.forEach(cmd => {
                if (cmd.perm.owner) { return }
                if (cmd.name == choice) { return }

                if (msg.lang == "pt-") {
                    menu.addOptions({ label: cmd.cat, value: cmd.name, description: cmd.desc })
                }
                else {
                    menu.addOptions({ label: cmd.catEn, value: cmd.name, description: cmd.descEn })
                }
            })

            if (botmsg == "") {
                botmsg = await botFmsg.edit({ embeds: [help], components: [{ type: 1, components: [bTermos, bSup] }, { type: 1, components: [menu] }] })
            }
            else {
                botmsg = await botmsg.edit({ embeds: [help], components: [{ type: 1, components: [bTermos, bSup] }, { type: 1, components: [menu] }] })
            }

            var filter = (interaction) => interaction.user.id === msg.author.id && interaction.customId === uniqueID
            await botmsg.awaitMessageComponent({ filter, time: 120000 })
                .then(async interaction => {
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 6,
                        }
                    })

                    choice = interaction.values[0]

                    try {
                        const cmd = client.commands.get(interaction.values[0])

                        if (msg.lang == "pt-") {

                            help = new client.Discord.MessageEmbed()
                                .setTitle(replaceAll(cmd.helpPt.title, "$prefix$", client.prefix))
                                .setColor(client.settings.color)
                                .setDescription(replaceAll(cmd.helpPt.desc, "$prefix$", client.prefix))
                                .setFooter(footer(), client.user.displayAvatarURL())
                                .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
                                .setTimestamp()
                            return

                        }
                        else {
                            help = new client.Discord.MessageEmbed()
                                .setTitle(replaceAll(cmd.helpEn.title, "$prefix$", client.prefix))
                                .setColor(client.settings.color)
                                .setDescription(replaceAll(cmd.helpEn.desc, "$prefix$", client.prefix))
                                .setFooter(footer(), client.user.displayAvatarURL())
                                .setImage("https://media.discordapp.net/attachments/737416028857958480/875401171710378044/background_ajuda.png")
                                .setTimestamp()
                            return
                        }
                    }
                    catch {
                        if (interaction.values[0] == "atributos") {
                            const atributos = client.resources[msg.lang.replace("-", "")].atributos

                            if (msg.lang == "en-") {
                                var atributosF = "Attributes:"
                            }
                            else {
                                var atributosF = "Atributos:"
                            }

                            for (x in atributos) {
                                if (x < atributos.length - 1) {
                                    atributosF += " " + atributos[x] + ","
                                }
                                if (x == atributos.length - 1) {
                                    atributosF += " " + atributos[x]
                                }
                            }

                            help = new client.Discord.MessageEmbed()
                                .setDescription("**" + atributosF + "**" + client.tl({ local: msg.lang + "ajuda-atributos" }))
                                .setColor(client.settings.color)
                                .setTitle("<:fichaAjuda:766790214550814770> " + client.tl({ local: msg.lang + "ajuda-tAtributos" }))
                                .setFooter(footer(), client.user.displayAvatarURL())
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
                        botmsg.edit({ content: null, components: [{ type: 1, components: [bTermos, bSup] }] })
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
