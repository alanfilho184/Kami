const moment = require("moment-timezone")
const toMs = require("milliseconds-parser")()

module.exports = {
    name: "componentHandler",
    type: "bot",
    execute: async (client, interaction) => {
        const regEx = /(^[a-zA-z]*)/g
        const func = interaction.customId.match(regEx)

        switch (func[0]) {
            case "irt":
                const regEx = /(^[a-zA-z]*)|((apg)|(des))|id:([0-9]*)|nomerpg:([a-zA-Z]*)|msgid:([0-9]*)|chid:([0-9]*)/g

                const irtInfo = interaction.customId.match(regEx)
                irtInfo.shift()

                const info = new Object()
                const msg = new Object()
                const uniqueID = `${Date.now()}`

                if (irtInfo[0] == "apg") {
                    irtInfo.shift()
                    irtInfo.forEach(m => {
                        info[m.split(":")[0]] = m.split(":")[1]
                    })

                    if (info.id != interaction.user.id) { return }

                    msg.lang = client.utils.getLang({
                        author: {
                            id: interaction.user.id,
                        },
                        guild: {
                            id: interaction.guildId
                        },
                        channel: {
                            type: interaction.message.channel.type
                        }
                    })


                    const bConf = new client.Discord.MessageButton()
                        .setStyle(3)
                        .setLabel(client.tl({ local: msg.lang + "bt-conf" }))
                        .setCustomId("conf|" + uniqueID)

                    const bCanc = new client.Discord.MessageButton()
                        .setStyle(4)
                        .setLabel(client.tl({ local: msg.lang + "bt-canc" }))
                        .setCustomId("canc|" + uniqueID)

                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 6,
                        }
                    })

                    const bApg = new client.Discord.MessageButton()
                        .setStyle(1)
                        .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                        .setDisabled(true)
                        .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                    interaction.message.edit({ components: [{ type: 1, components: [bApg, bConf, bCanc] }] })
                        .then(botmsg => {
                            const filter = (interaction) => interaction.user.id === info.id && interaction.customId.split("|")[1] === uniqueID
                            botmsg.awaitMessageComponent({ filter, time: 30000 })
                                .then(interaction => {
                                    const choice = interaction.customId.split("|")[0]

                                    if (choice == "conf") {
                                        interaction.message.delete()

                                        client.db.query(`delete from irt where msgid = '${info.msgid}' and id = '${info.id}' and nomerpg = '${info.nomerpg}'`)
                                        client.cache.deleteIrt(info.id, info.nomerpg, info.msgid)
                                    }
                                    else if (choice == "canc") {
                                        client.api.interactions(interaction.id, interaction.token).callback.post({
                                            data: {
                                                type: 6,
                                            }
                                        })

                                        const bDes = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                                            .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        const bApg = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                                            .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        interaction.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })
                                    }
                                })
                                .catch(err => {
                                    if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                        const bDes = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                                            .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        const bApg = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                                            .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        interaction.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })

                                        return
                                    }
                                    else {
                                        client.log.error(err, true)
                                    }
                                })
                        })
                }
                else if (irtInfo[0] == "des") {
                    irtInfo.shift()

                    irtInfo.forEach(m => {
                        info[m.split(":")[0]] = m.split(":")[1]
                    })

                    if (info.id != interaction.user.id) { return }


                    msg.lang = client.utils.getLang({
                        author: {
                            id: interaction.user.id,
                        },
                        guild: {
                            id: interaction.guildId
                        },
                        channel: {
                            type: interaction.message.channel.type
                        }
                    })

                    const bConf = new client.Discord.MessageButton()
                        .setStyle(3)
                        .setLabel(client.tl({ local: msg.lang + "bt-conf" }))
                        .setCustomId("conf|" + uniqueID)

                    const bCanc = new client.Discord.MessageButton()
                        .setStyle(4)
                        .setLabel(client.tl({ local: msg.lang + "bt-canc" }))
                        .setCustomId("canc|" + uniqueID)

                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 6,
                        }
                    })

                    const bDes = new client.Discord.MessageButton()
                        .setStyle(1)
                        .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                        .setDisabled(true)
                        .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                    interaction.message.edit({ components: [{ type: 1, components: [bDes, bConf, bCanc] }] })
                        .then(botmsg => {
                            const filter = (interaction) => interaction.user.id === info.id && interaction.customId.split("|")[1] === uniqueID
                            botmsg.awaitMessageComponent({ filter, time: 30000 })
                                .then(interaction => {
                                    const choice = interaction.customId.split("|")[0]

                                    if (choice == "conf") {
                                        interaction.message.edit({ components: [] })
                                        client.db.query(`delete from irt where msgid = '${info.msgid}' and id = '${info.id}' and nomerpg = '${info.nomerpg}'`)
                                        client.cache.deleteIrt(info.id, info.nomerpg, info.msgid)
                                    }
                                    else if (choice == "canc") {
                                        client.api.interactions(interaction.id, interaction.token).callback.post({
                                            data: {
                                                type: 6,
                                            }
                                        })

                                        const bDes = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                                            .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        const bApg = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                                            .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        interaction.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })
                                    }
                                })
                                .catch(err => {
                                    if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                        const bDes = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                                            .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        const bApg = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                                            .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        interaction.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })

                                        return
                                    }
                                    else {
                                        client.log.error(err, true)
                                    }
                                })
                        })
                }
        }
    }
}