function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: "updtFicha",
    type: "bot",
    execute: async (client, msg, info) => {
        const nomeRpg = info.nomeRpg
        const user = msg.author.id

        client.cache.getIrt(msg.author.id, nomeRpg)
            .then(async irt => {

                const fichaUser = await client.cache.getFicha(user, nomeRpg)
                const reply = client.commands.get("enviar").create(client, msg, nomeRpg, fichaUser, "irtUpdt")
                const embedsArray = Object.values(reply)

                for (m in irt) {
                    try {
                        const ch = await client.channels.fetch(irt[m].chid)
                        const irtMsg = await ch.messages.fetch(irt[m].msgid)

                        await irtMsg.edit({ embeds: embedsArray })
                            .then(e => { client.log.info(irt[m]) })
                    }
                    catch (err) {
                        if (err == "DiscordAPIError: Unknown Channel") {
                            client.db.query(`delete from irt where chid = '${irt[m].chid}'`)
                        }
                        else if (err == "DiscordAPIError: Unknown Message") {
                            client.db.query(`delete from irt where msgid = '${irt[m].msgid}' and id = '${user}' and nomerpg = '${nomeRpg}'`)
                            client.cache.deleteIrt(user, nomeRpg, irt[m].msgid)
                        }
                        else {
                            client.log.error(err, true)
                            client.log.error(`Info erro IRT:`)
                            client.log.warn(irt)
                            client.log.warn(msg)
                        }
                    }
                    await sleep(4000)
                }

                return

            })
    }
}