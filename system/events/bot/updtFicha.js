function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: "updtFicha",
    type: "bot",
    execute: async (client, int, info) => {
        const nomerpg = info.nomerpg
        const user = int.user.id

        var irt = info.irt

        const fichaUser = await client.cache.getFicha(user, nomerpg)
        const reply = client.commands.get("enviar").create(client, int, fichaUser)

        for (m in irt) {
            try {
                const ch = await client.channels.fetch(irt[m].chid)
                const irtMsg = await ch.messages.fetch(irt[m].msgid)

                int.lang = client.utils.getLang({
                    guildId: ch.guild.id || null,
                    user: {
                        id: int.user.id
                    },
                    inGuild() { ch.type == "GUILD_TEXT" }
                })

                await irtMsg.edit({ embeds: reply })
                    .then(e => { client.log.info(irt[m]) })
            }
            catch (err) {
                if (err == "DiscordAPIError: Unknown Channel") {
                    client.db.query(`delete from irt where chid = '${irt[m].chid}'`)
                }
                else if (err == "DiscordAPIError: Unknown Message") {
                    client.db.query(`delete from irt where msgid = '${irt[m].msgid}' and id = '${user}' and nomerpg = '${nomerpg}'`)
                    client.cache.deleteIrt(user, nomerpg, irt[m].msgid)
                }
                else {
                    client.log.error(err, true)
                    client.log.error(`Info erro IRT:`)
                    client.log.warn(irt)
                    client.log.warn(int)
                }
            }
            await sleep(4000)
        }
        return
    }
}