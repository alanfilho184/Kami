module.exports = class config {
    constructor() {
        return {
            ownerOnly: false,
            name: "config",
            fName: "Config",
            fNameEn: "Config",
            desc: 'Configurações de alguns comandos do BOT.',
            descEn: 'Configuration of some BOT\'s commands.',
            args: [],
            options: [],
            type: 1,
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

    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(async () => {
                if(int.guildId == null){
                    return int.editReply("Este comando não está disponível em DM's por enquanto.")
                }
                var repeat = true
                var botmsg

                while (repeat) {
                    const userConfig = client.cache.get(int.user.id) || {
                        lang: null,
                        roll: null,
                        insan: null,
                        fPadrao: null,
                        rollChannel: null
                    }

                    const gui = new client.Discord.MessageEmbed()
                        .setTitle(client.tl({ local: int.lang + "config-guiTi" }))
                        .addFields(
                            { name: client.tl({ local: int.lang + "config-guiF1" }), value: `${userConfig.roll == "true" ? client.tl({ local: int.lang + "config-guiAct" }) : client.tl({ local: int.lang + "config-guiDes" })}`, inline: true },
                            { name: client.tl({ local: int.lang + "config-guiF2" }), value: `${userConfig.insan == "true" ? client.tl({ local: int.lang + "config-guiAct" }) : client.tl({ local: int.lang + "config-guiDes" })}`, inline: true },
                            { name: client.tl({ local: int.lang + "config-guiF3" }), value: `${userConfig.fPadrao ? userConfig.fPadrao : client.tl({ local: int.lang + "config-guiSFP" })}`, inline: true }
                        )
                        .setColor(client.settings.color)
                        .setFooter(client.resources[int.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
                        .setTimestamp()

                    const uniqueID = `${Date.now()}`
                    const menu = new client.Discord.MessageSelectMenu()
                        .setCustomId("fPadrao|" + uniqueID)
                        .setPlaceholder(userConfig.fPadrao ? userConfig.fPadrao : client.tl({ local: int.lang + "config-menuPH" }))

                    const fichas = await client.commands.get("listar").api(client, int.user.id)

                    fichas.forEach(f => {
                        if (f != userConfig.fPadrao) {
                            menu.addOptions({ label: f, value: f })
                        }
                    })

                    if (userConfig.fPadrao) { menu.addOptions({ label: client.tl({ local: int.lang + "config-menuEFP" }), value: "excluir" }) }

                    const bRoll = new client.Discord.MessageButton()
                        .setStyle(userConfig.roll == "true" ? 4 : 3)
                        .setLabel(userConfig.roll == "true" ? client.tl({ local: int.lang + "config-btDesRS" }) : client.tl({ local: int.lang + "config-btActRS" }))
                        .setCustomId("rollS|" + uniqueID)

                    const bInsan = new client.Discord.MessageButton()
                        .setStyle(userConfig.insan == "true" ? 4 : 3)
                        .setLabel(userConfig.insan == "true" ? client.tl({ local: int.lang + "config-btDesIS" }) : client.tl({ local: int.lang + "config-btActIS" }))
                        .setCustomId("insS|" + uniqueID)

                    const bF = new client.Discord.MessageButton()
                        .setStyle(1)
                        .setLabel(client.tl({ local: int.lang + "config-btF" }))
                        .setCustomId("done|" + uniqueID)

                    const menuComp = [{ type: 1, components: [bRoll, bInsan, bF] }]

                    if (fichas.length > 0) { menuComp.push({ type: 1, components: [menu] }) }

                    botmsg = await int.editReply({ content: null, embeds: [gui], components: menuComp })

                    var filter = (interaction) => interaction.user.id === int.user.id && interaction.customId.split("|")[1] === uniqueID
                    await botmsg.awaitMessageComponent({ filter, time: 60000 })
                        .then(async interaction => {
                            interaction.deferUpdate()

                            if (interaction.componentType == "BUTTON") {
                                const choice = interaction.customId.split("|")[0]

                                if (choice == "rollS") {
                                    if (userConfig.roll == "true") {
                                        await client.cache.update(int.user.id, "false", "roll", false)
                                        return
                                    }
                                    else {
                                        await client.cache.update(int.user.id, "true", "roll", false)
                                        return
                                    }
                                }
                                else if (choice == "insS") {
                                    if (userConfig.insan == "true") {
                                        await client.cache.update(int.user.id, "false", "insan", false)
                                        return
                                    }
                                    else {
                                        await client.cache.update(int.user.id, "true", "insan", false)
                                        return
                                    }
                                }
                                else if (choice == "done") {
                                    int.editReply({ content: null, components: [] })
                                    repeat = false
                                    return
                                }
                            }
                            else {
                                if (interaction.values[0] == "excluir") {
                                    await client.cache.update(int.user.id, null, "fPadrao", false)
                                    return
                                }
                                else {
                                    await client.cache.update(int.user.id, interaction.values[0], "fPadrao", false)
                                    return
                                }
                            }
                        })
                        .catch(err => {
                            if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                int.editReply({ content: null, components: [] })
                            }
                            else {
                                client.log.error(err, true)
                            }

                            repeat = false
                            return
                        })
                }

            })

    }
}