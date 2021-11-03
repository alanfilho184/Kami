async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class apagar {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "apagar",
            cat: "Apagar",
            catEn: "Delete",
            desc: 'Apaga uma ficha que já tenha sido criada.',
            descEn: 'Deletes a sheet that has already been created.',
            aliases: ["apagar", "delete"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "apagar", desc: `
    Este comando serve para caso não for mais utilizar a ficha, poder apagá-la

_Formato do comando:_
**${"/"}apagar <nome_da_ficha>**

Ex: **${"/"}apagar RPG_Kami**

Você também pode usar este comando pra desativar fichas IRT

Ex: **${"/"}apagar RPG_Kami irt**
`},

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "apagar", desc: `
    This command is used in case of the sheet is not used anymore, to be able to delete it

    _Format of the command:_
    **${"/"}apagar <sheet_name>**

    Ex: **${"/"}apagar RPG_Kami**

    You can also use this command to deactivate IRT sheets

    Ex: **${"/"}apagar RPG_Kami irt**
    `},
            run: this.execute
        }
    }
    execute(client, msg) {
        var args = client.utils.args(msg)

        const beta = client.whitelist.get("beta")
        const premium = client.whitelist.get("premium")

        if (!args[0]) { return msg.reply(client.tl({ local: msg.lang + "af-sNomeRpg" })) }

        var nomeRpg = args[0]
        var irt = args[1]
        if (!irt) { irt = "false" }

        try { nomeRpg = nomeRpg.replace(/[^\w\s]/gi, '') } catch { }

        client.db.query(`select * from fichas where id = '${msg.author.id}' and nomerpg = '${args[0]}'`)
            .then(async result => {
                if (result[0] == "") { return msg.reply(client.tl({ local: msg.lang + "af-fNE", nomeRpg: args[0] })) }
                else {
                    if (irt.toLowerCase() == "irt") {
                        client.db.query(`select * from irt where id = '${msg.author.id}' and nomerpg = '${nomeRpg}'`)
                            .then(irt => {
                                if (irt[0][0]) {

                                    client.cache.getIrt(msg.author.id, nomeRpg)
                                        .then(async fichasIrt => {
                                            for (var f of fichasIrt) {
                                                const c = client.channels.cache.get(f.chid)
                                                const m = await c.messages.fetch(f.msgid)

                                                await m.edit({ components: [] })
                                                await sleep(6000)
                                            }
                                        })

                                    client.db.query(`delete from irt where id = '${msg.author.id}' and nomerpg = '${nomeRpg}'`)
                                        .then(r => {
                                            return msg.reply(client.tl({ local: msg.lang + "af-deacIrt", nomeRpg: nomeRpg }))
                                        })
                                    client.cache.deleteIrt(msg.author.id, nomeRpg)
                                }
                                else {
                                    return msg.reply(client.tl({ local: msg.lang + "af-irtNF", nomeRpg: nomeRpg }))
                                }
                            })

                        return
                    }

                    const uniqueID = `${Date.now()}`
                    const bConf = new client.Discord.MessageButton()
                        .setStyle(3)
                        .setLabel(client.tl({ local: msg.lang + "bt-conf" }))
                        .setCustomId("conf|" + uniqueID)

                    const bCanc = new client.Discord.MessageButton()
                        .setStyle(4)
                        .setLabel(client.tl({ local: msg.lang + "bt-canc" }))
                        .setCustomId("canc|" + uniqueID)

                    msg.reply({ content: client.tl({ local: msg.lang + "af-cEF", nomeRpg: args[0] }), components: [{ type: 1, components: [bConf, bCanc] }] })
                        .then(botmsg => {

                            const filter = (interaction) => interaction.user.id === msg.author.id && interaction.customId.split("|")[1] === uniqueID
                            botmsg.awaitMessageComponent({ filter, time: 30000 })
                                .then(interaction => {
                                    const choice = interaction.customId.split("|")[0]

                                    if (choice == "conf") {
                                        client.db.query(`delete from fichas where id = '${msg.author.id}' and nomerpg = '${args[0]}'`)
                                            .catch(err => { client.log.error(err, true) })
                                            .then(() => {
                                                client.cache.deleteFicha(msg.author.id, args[0])

                                                botmsg.edit({ content: client.tl({ local: msg.lang + "af-fApg", nomeRpg: args[0] }), components: [] })
                                                    .then(async function () {
                                                        client.cache.getIrt(msg.author.id, nomeRpg)
                                                            .then(infoUIRT => {
                                                                if (infoUIRT != "" && beta.has(`${msg.author.id}`)) {
                                                                    client.emit("apgFicha", { id: msg.author.id, nomeRpg: nomeRpg })
                                                                }
                                                            })
                                                    })
                                            })
                                    }
                                    else if (choice == "canc") {

                                        botmsg.edit({ content: client.tl({ local: msg.lang + "af-fM", nomeRpg: args[0] }), components: [] })
                                    }
                                })
                                .catch(err => {
                                    if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                        return botmsg.edit({ content: client.tl({ local: msg.lang + "af-sConfirm", nomeRpg: args[0] }), components: [] })
                                    }
                                    else {
                                        client.log.error(err, true)
                                    }
                                })
                        })

                }
            })
            .catch(err => { client.log.error(err, true) })
    }
}

