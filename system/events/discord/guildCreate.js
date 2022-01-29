const time = require("luxon").DateTime

module.exports = {
    name: "guildCreate",
    type: "djs",
    execute: async (client, guild) => {
        client.log.info("Bot adicionado em servidor")

        var owner = new Array()
        await client.users.fetch(guild.ownerId).then(user => owner.push(user))

        const gCreateEmbed = new client.Discord.MessageEmbed()
        gCreateEmbed.setTitle("Bot adicionando em servidor")
        gCreateEmbed.setThumbnail(guild.iconURL())
        gCreateEmbed.addFields(
            { name: "Servidor:", value: "Nome: " + guild.name + "\nID: " + guild.id + "\n Quantidade de usuários: " + guild.memberCount },
            { name: "Dono:", value: owner[0].tag + "\nID: " + owner[0].id },
        )
        gCreateEmbed.setFooter({text:`Adicionado em: ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")} (GMT -3)`})
        gCreateEmbed.setColor(client.settings.color)

        client.log.embed(gCreateEmbed)
    }
}