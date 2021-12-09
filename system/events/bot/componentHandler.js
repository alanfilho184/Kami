const setLang = require("../../resources/scripts/lang").setLang
const passedInts = new Map()

module.exports = {
    name: "componentHandler",
    type: "bot",
    execute: async (client, comp) => {
        const regEx = /(^[a-zA-z]*)/g
        const func = comp.customId.match(regEx)

        switch (func[0]) {
            case "irt":
                const testIrt = /(^[a-zA-z]*)|((apg)|(des))|id:([0-9]*)|nomerpg:([a-zA-Z]*)|msgid:([0-9]*)|chid:([0-9]*)/g

                const irtInfo = comp.customId.match(testIrt)
                irtInfo.shift()

                const info = new Object()
                const msg = new Object()
                const uniqueID = `${Date.now()}`

                if (irtInfo[0] == "apg") {
                    irtInfo.shift()
                    irtInfo.forEach(m => {
                        info[m.split(":")[0]] = m.split(":")[1]
                    })

                    if (info.id != comp.user.id) { return }

                    msg.lang = client.utils.getLang({
                        guildId: comp.guildId,
                        user: {
                            id: comp.user.id
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

                    comp.deferUpdate()

                    const bApg = new client.Discord.MessageButton()
                        .setStyle(1)
                        .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                        .setDisabled(true)
                        .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                    comp.message.edit({ components: [{ type: 1, components: [bApg, bConf, bCanc] }] })
                        .then(botmsg => {

                            const filter = (int) => int.user.id === info.id && int.customId.split("|")[1] === uniqueID
                            botmsg.awaitMessageComponent({ filter, time: 30000 })
                                .then(int => {
                                    const choice = int.customId.split("|")[0]

                                    if (choice == "conf") {
                                        int.message.delete()

                                        client.db.query(`delete from irt where msgid = '${info.msgid}' and id = '${info.id}' and nomerpg = '${info.nomerpg}'`)
                                        client.cache.deleteIrt(info.id, info.nomerpg, info.msgid)
                                    }
                                    else if (choice == "canc") {
                                        int.deferUpdate()

                                        const bDes = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                                            .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        const bApg = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                                            .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        int.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })
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

                                        int.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })

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

                    if (info.id != comp.user.id) { return }


                    msg.lang = client.utils.getLang({
                        guildId: comp.guildId,
                        user: {
                            id: comp.user.id
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

                    comp.deferUpdate()

                    const bDes = new client.Discord.MessageButton()
                        .setStyle(1)
                        .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                        .setDisabled(true)
                        .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                    comp.message.edit({ components: [{ type: 1, components: [bDes, bConf, bCanc] }] })
                        .then(botmsg => {
                            const filter = (int) => int.user.id === info.id && int.customId.split("|")[1] === uniqueID
                            botmsg.awaitMessageComponent({ filter, time: 30000 })
                                .then(async int => {
                                    const choice = int.customId.split("|")[0]

                                    if (choice == "conf") {
                                        await client.db.query(`delete from irt where msgid = '${info.msgid}' and id = '${info.id}' and nomerpg = '${info.nomerpg}'`)
                                        await client.cache.deleteIrt(info.id, info.nomerpg, info.msgid)
                                        int.message.edit({ components: [] })
                                    }
                                    else if (choice == "canc") {
                                        int.deferUpdate()

                                        const bDes = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-desIrt" }))
                                            .setCustomId(`irt|des|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        const bApg = new client.Discord.MessageButton()
                                            .setStyle(2)
                                            .setLabel(client.tl({ local: msg.lang + "bt-apgIrt" }))
                                            .setCustomId(`irt|apg|id:${info.id}|nomerpg:${info.nomeRpg}|msgid:${info.msgid}|chid:${info.chid}`)

                                        int.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })
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

                                        comp.message.edit({ components: [{ type: 1, components: [bDes, bApg] }] })

                                        return
                                    }
                                    else {
                                        client.log.error(err, true)
                                    }
                                })
                        })
                }
            case "lang":
                const testLang = /(^[a-zA-z]*)|((pt)|(en)|(canc))|intid:([0-9]*)|userid:([0-9]*)/g

                const langInfo = comp.customId.match(testLang)
                langInfo.shift()

                if (langInfo[2].split(":")[1] == comp.user.id) {
                    comp.deferUpdate()

                    const int = passedInts.get(langInfo[1].split(":")[1])

                    if (langInfo[0] == "pt") {
                        setLang(client, comp, "user", "pt-")
                        int.editReply({ content: client.tl({ local: `pt-eL-brDm` }), embeds: [], components: [] })
                        passedInts.delete(langInfo[1].split(":")[1])
                        return
                    }
                    else if (langInfo[0] == "en") {
                        setLang(client, comp, "user", "en-")
                        int.editReply({ content: client.tl({ local: `en-eL-enDm` }), embeds: [], components: [] })
                        passedInts.delete(langInfo[1].split(":")[1])
                        return
                    }
                    else if (langInfo[0] == "canc") {
                        int.editReply({ content: `Ok, nada foi selecionado | Ok, nothing was selected`, embeds: [], components: [] })
                        passedInts.delete(langInfo[1].split(":")[1])
                        return
                    }
                }
                else {
                    return
                }

        }
    },
    passInt: (client, info) => {
        passedInts.set(info.intid, info.int)
    }
}