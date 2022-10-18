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
                var repeat = true
                var botmsg

                while (repeat) {
                    const userConfig = client.cache.get(int.user.id) || {
                        lang: null,
                        fPadrao: null,
                        roll: null,
                        insan: null,
                        geral: null,
                        ficha: null,
                        enviar: null
                    }

                    const gui = new client.Discord.EmbedBuilder()
                        .setTitle(client.tl({ local: int.lang + "config-guiTi" }))
                        .addFields(
                            { name: client.tl({ local: int.lang + "config-guiSepS" }) + "\n" + client.tl({ local: int.lang + "config-guiF1" }), value: `${userConfig.roll == "true" ? client.tl({ local: int.lang + "config-guiAct" }) : client.tl({ local: int.lang + "config-guiDes" })}`, inline: true },
                            { name: "\u200b" + "\n" + client.tl({ local: int.lang + "config-guiF2" }), value: `${userConfig.insan == "true" ? client.tl({ local: int.lang + "config-guiAct" }) : client.tl({ local: int.lang + "config-guiDes" })}`, inline: true },
                            { name: "\u200b" + "\n" + client.tl({ local: int.lang + "config-guiF3" }), value: `${userConfig.geral == "true" ? client.tl({ local: int.lang + "config-guiAct" }) : client.tl({ local: int.lang + "config-guiDes" })}`, inline: true },
                        )
                        .addFields(
                            { name: client.tl({ local: int.lang + "config-guiF4" }), value: `${userConfig.ficha == "true" ? client.tl({ local: int.lang + "config-guiAct" }) : client.tl({ local: int.lang + "config-guiDes" })}`, inline: true },
                            { name: client.tl({ local: int.lang + "config-guiF5" }), value: `${userConfig.enviar == "true" ? client.tl({ local: int.lang + "config-guiAct" }) : client.tl({ local: int.lang + "config-guiDes" })}`, inline: true },
                        )
                        .addFields({name: client.tl({ local: int.lang + "config-guiSepO" }) + "\n" + client.tl({ local: int.lang + "config-guiF6" }), value: `${userConfig.fPadrao ? userConfig.fPadrao : client.tl({ local: int.lang + "config-guiSFP" })}`, inline: false})
                        .setColor(parseInt(process.env.EMBED_COLOR))
                        .setFooter({text: client.resources.footer(), iconURL: client.user.displayAvatarURL()})
                        .setTimestamp()

                    const uniqueID = `${Date.now()}`
                    const menu = new client.Discord.SelectMenuBuilder()
                        .setCustomId("fPadrao|" + uniqueID)
                        .setPlaceholder(userConfig.fPadrao ? userConfig.fPadrao : client.tl({ local: int.lang + "config-menuPH" }))

                    const fichas = await client.commands.get("listar").api(client, int.user.id)

                    fichas.forEach(f => {
                        if (f != userConfig.fPadrao) {
                            menu.addOptions({ label: f, value: f })
                        }
                    })

                    if (userConfig.fPadrao) { menu.addOptions({ label: client.tl({ local: int.lang + "config-menuEFP" }), value: "excluir" }) }

                    const bRoll = new client.Discord.ButtonBuilder()
                        .setStyle(userConfig.roll == "true" ? 4 : 3)
                        .setLabel(userConfig.roll == "true" ? client.tl({ local: int.lang + "config-btDesRS" }) : client.tl({ local: int.lang + "config-btActRS" }))
                        .setCustomId("rollS|" + uniqueID)

                    const bInsan = new client.Discord.ButtonBuilder()
                        .setStyle(userConfig.insan == "true" ? 4 : 3)
                        .setLabel(userConfig.insan == "true" ? client.tl({ local: int.lang + "config-btDesIS" }) : client.tl({ local: int.lang + "config-btActIS" }))
                        .setCustomId("insS|" + uniqueID)

                    const bGeral = new client.Discord.ButtonBuilder()
                        .setStyle(userConfig.geral == "true" ? 4 : 3)
                        .setLabel(userConfig.geral == "true" ? client.tl({ local: int.lang + "config-btDesG" }) : client.tl({ local: int.lang + "config-btActG" }))
                        .setCustomId("geralS|" + uniqueID)

                    const bFicha = new client.Discord.ButtonBuilder()
                        .setStyle(userConfig.ficha == "true" ? 4 : 3)
                        .setLabel(userConfig.ficha == "true" ? client.tl({ local: int.lang + "config-btDesF" }) : client.tl({ local: int.lang + "config-btActF" }))
                        .setCustomId("fichaS|" + uniqueID)

                    const bEnviar = new client.Discord.ButtonBuilder()
                        .setStyle(userConfig.enviar == "true" ? 4 : 3)
                        .setLabel(userConfig.enviar == "true" ? client.tl({ local: int.lang + "config-btDesE" }) : client.tl({ local: int.lang + "config-btActE" }))
                        .setCustomId("enviarS|" + uniqueID)

                    const bF = new client.Discord.ButtonBuilder()
                        .setStyle(1)
                        .setLabel(client.tl({ local: int.lang + "config-btF" }))
                        .setCustomId("done|" + uniqueID)

                    const menuComp = [{ type: 1, components: [bRoll, bInsan, bGeral] }, { type: 1, components: [bFicha, bEnviar, bF] }]

                    if (fichas.length > 0) { menuComp.push({ type: 1, components: [menu] }) }

                    botmsg = await int.editReply({ content: null, embeds: [gui], components: menuComp })

                    if (!int.inGuild()) { botmsg = await client.channels.fetch(int.channelId) }

                    var filter = (interaction) => interaction.user.id === int.user.id && interaction.customId.split("|")[1] === uniqueID
                    await botmsg.awaitMessageComponent({ filter, time: 60000 })
                        .then(async interaction => {
                            interaction.deferUpdate()

                            if (interaction.componentType == 2) {
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
                                else if (choice == "geralS") {
                                    if (userConfig.geral == "true") {
                                        await client.cache.update(int.user.id, "false", "geral", false)
                                        return
                                    }
                                    else {
                                        await client.cache.update(int.user.id, "true", "geral", false)
                                        return
                                    }
                                }
                                else if (choice == "fichaS") {
                                    if (userConfig.ficha == "true") {
                                        await client.cache.update(int.user.id, "false", "ficha", false)
                                        return
                                    }
                                    else {
                                        await client.cache.update(int.user.id, "true", "ficha", false)
                                        return
                                    }
                                }
                                else if (choice == "enviarS") {
                                    if (userConfig.enviar == "true") {
                                        await client.cache.update(int.user.id, "false", "enviar", false)
                                        return
                                    }
                                    else {
                                        await client.cache.update(int.user.id, "true", "enviar", false)
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
                            if (err.code == "InteractionCollectorError") {
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