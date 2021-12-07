const message = require("../../events/discord/message")

module.exports = class config {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "config",
            cat: "Config",
            catEn: "Config",
            desc: 'Configurações de alguns comandos do BOT.',
            descEn: 'Configuration of some BOT\'s commands.',
            aliases: ["configuração"],
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "config", desc: `Esse comando mostra opções de diversos comandos
                
                Ex: **${"/"}config**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "config", desc: `This command shows options of many commands
            
                Ex: **${"/"}config**`
            },
            run: this.execute
        }
    }

    async execute(client, msg) {
        var repeat = true
        var botFmsg = await msg.reply({ content: "<a:loading:772142378563534888> " + client.tl({ local: msg.lang + "botI-gI" }) })
        var botmsg = ""
        while (repeat) {
            const userConfig = client.cache.get(msg.author.id) || {
                lang: null,
                roll: null,
                insan: null,
                fPadrao: null,
                rollChannel: null
            }

            const gui = new client.Discord.MessageEmbed()
                .setTitle(client.tl({ local: msg.lang + "config-guiTi" }))
                .addFields(
                    { name: client.tl({ local: msg.lang + "config-guiF1" }), value: `${userConfig.roll == "true" ? client.tl({ local: msg.lang + "config-guiAct" }) : client.tl({ local: msg.lang + "config-guiDes" })}`, inline: true },
                    { name: client.tl({ local: msg.lang + "config-guiF2" }), value: `${userConfig.insan == "true" ? client.tl({ local: msg.lang + "config-guiAct" }) : client.tl({ local: msg.lang + "config-guiDes" })}`, inline: true },
                    { name: client.tl({ local: msg.lang + "config-guiF3" }), value: `${userConfig.fPadrao ? userConfig.fPadrao : client.tl({ local: msg.lang + "config-guiSFP" })}`, inline: true }
                )
                .setColor(client.settings.color)
                .setFooter(client.resources[msg.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
                .setTimestamp()

            const uniqueID = `${Date.now()}`
            const menu = new client.Discord.MessageSelectMenu()
                .setCustomId("fPadrao|" + uniqueID)
                .setPlaceholder(userConfig.fPadrao ? userConfig.fPadrao : client.tl({ local: msg.lang + "config-menuPH" }))

            const fichas = await client.commands.get("listar").api(client, msg.author.id)

            fichas.forEach(f => {
                if (f != userConfig.fPadrao) {
                    menu.addOptions({ label: f, value: f })
                }
            })

            if (userConfig.fPadrao) { menu.addOptions({ label: client.tl({ local: msg.lang + "config-menuEFP" }), value: "excluir" }) }

            const bRoll = new client.Discord.MessageButton()
                .setStyle(userConfig.roll == "true" ? 4 : 3)
                .setLabel(userConfig.roll == "true" ? client.tl({ local: msg.lang + "config-btDesRS" }) : client.tl({ local: msg.lang + "config-btActRS" }))
                .setCustomId("rollS|" + uniqueID)

            const bInsan = new client.Discord.MessageButton()
                .setStyle(userConfig.insan == "true" ? 4 : 3)
                .setLabel(userConfig.insan == "true" ? client.tl({ local: msg.lang + "config-btDesIS" }) : client.tl({ local: msg.lang + "config-btActIS" }))
                .setCustomId("insS|" + uniqueID)

            const bF = new client.Discord.MessageButton()
                .setStyle(1)
                .setLabel(client.tl({ local: msg.lang + "config-btF" }))
                .setCustomId("done|" + uniqueID)

            const menuComp = [{ type: 1, components: [bRoll, bInsan, bF] }]

            if (fichas.length > 0) { menuComp.push({ type: 1, components: [menu] }) }

            if (botmsg == "") { botmsg = await botFmsg.edit({ content: null, embeds: [gui], components: menuComp }) }
            else { botmsg = await botmsg.edit({ content: null, embeds: [gui], components: menuComp }) }

            var filter = (interaction) => interaction.user.id === msg.author.id && interaction.customId.split("|")[1] === uniqueID
            await botmsg.awaitMessageComponent({ filter, time: 60000 })
                .then(async interaction => {
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 6,
                        }
                    })
                    if (interaction.componentType == "BUTTON") {
                        const choice = interaction.customId.split("|")[0]

                        if (choice == "rollS") {
                            if (userConfig.roll == "true") {
                                await client.cache.update(msg.author.id, "false", "roll", false)
                                return
                            }
                            else {
                                await client.cache.update(msg.author.id, "true", "roll", false)
                                return
                            }
                        }
                        else if (choice == "insS") {
                            if (userConfig.insan == "true") {
                                await client.cache.update(msg.author.id, "false", "insan", false)
                                return
                            }
                            else {
                                await client.cache.update(msg.author.id, "true", "insan", false)
                                return
                            }
                        }
                        else if (choice == "done") {
                            botmsg.edit({ content: null, components: [] })
                            repeat = false
                            return
                        }
                    }
                    else {
                        if (interaction.values[0] == "excluir") {
                            await client.cache.update(msg.author.id, null, "fPadrao", false)
                            return
                        }
                        else {
                            await client.cache.update(msg.author.id, interaction.values[0], "fPadrao", false)
                            return
                        }
                    }
                })
                .catch(err => {
                    if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                        botmsg.edit({ content: null, components: [] })
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