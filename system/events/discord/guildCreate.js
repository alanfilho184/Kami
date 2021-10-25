const moment = require("moment-timezone")

module.exports = {
    name: "guildCreate",
    type: "djs",
    execute: async (client, guild) => {
        client.log.info("Bot adicionado em servidor")

        Lang = "pt-"

        var owner = new Array()
        await client.users.fetch(guild.ownerId).then(user => owner.push(user))

        const gCreateEmbed = new client.Discord.MessageEmbed()
        gCreateEmbed.setTitle("Bot adicionando em servidor")
        gCreateEmbed.setThumbnail(guild.iconURL())
        gCreateEmbed.addFields(
            { name: "Servidor:", value: "Nome: " + guild.name + "\nID: " + guild.id + "\n Quantidade de usuários: " + guild.memberCount },
            { name: "Dono:", value: owner[0].tag + "\nID: " + owner[0].id },
        )
        gCreateEmbed.setFooter(`Adicionado em: ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss ")} (GMT -3)`)
        gCreateEmbed.setColor(client.settings.color)

        try {
            await client.channels.fetch(guild.systemChannelId)
                .then(c => {
                    c.send(client.tl({ local: Lang + "onGCreate-saudacao" }))
                })
                .catch(err => { throw err })
        }
        catch (err) {
            client.log.warn("Servidor sem canal de mensagens do sistema")
            var defaultChannel = new String();
            await guild.channels.fetch().then(c => {
                c.forEach((channel) => {
                    if (channel.type == "text" && defaultChannel == "") {
                        if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                            defaultChannel = channel;
                            return defaultChannel
                        }
                    }
                })

                try { defaultChannel.send(client.tl({ local: Lang + "onGCreate-saudacao" })) } catch (err) { client.log.warn("BOT sem permissão de enviar mensagens em nenhum canal do servidor") }
            })
        }

        client.log.embed(gCreateEmbed)
    }
}