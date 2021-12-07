const moment = require("moment-timezone")

module.exports = {
    name: "guildDelete",
    type: "djs",
    execute: async (client, guild) => {
        client.log.info("Bot removido de servidor")

        Lang = "pt-"

        var owner = new Array()
        await client.users.fetch(guild.ownerId).then(user => owner.push(user))

        const gCreateEmbed = new client.Discord.MessageEmbed()
        gCreateEmbed.setTitle("Bot removido de servidor")
        gCreateEmbed.setThumbnail(guild.iconURL())
        gCreateEmbed.addFields(
            { name: "Servidor:", value: "Nome: " + guild.name + "\nID: " + guild.id + "\n Quantidade de usuários: " + guild.memberCount },
            { name: "Dono:", value: owner[0].tag + "\nID: " + owner[0].id },
        )
        gCreateEmbed.setFooter(`Removido em: ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss ")} (GMT -3)`)
        gCreateEmbed.setColor(client.settings.color)

        await client.db.query(`delete from config where serverid = '${guild.id}'`)
            .catch(err => client.log.error(err, true))

        client.log.embed(gCreateEmbed)
    }
}