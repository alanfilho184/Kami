const time = require("luxon").DateTime

module.exports = {
    name: "cmd",
    type: "bot",
    execute: async (client, int, cmd) => {
        client.cache.updateCnt("cmd")

        var Lang = int.lang

        args = client.utils.argsString(int) || "Nenhum argumento dado"

        let idioma
        try {
            idioma = Lang.replace("-", "").toUpperCase()
        }
        catch (err) {
            idioma = "Nenhum idioma configurado"
        }

        const cmdEmbed = new client.Discord.EmbedBuilder()
            .setTitle("Comando: `" + cmd + "`")
            .setAuthor({ name: `${int.user.tag} - ${int.user.id}`, iconURL: int.user.displayAvatarURL() })
            .setDescription("**Args:**\n" + "`" + args + "`")
            .addFields({ name: "Idioma: ", value: "`" + idioma + "`", inline: true })
            .setFooter({ text: "Executado em: " + time.now(int.createdTimestamp).setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ") + "(GMT -3)" })
            .setColor(client.settings.color)

        if (int.guildId != null) {
            cmdEmbed.addFields({ name: "Local: ", value: "`" + int.member.guild.name + "` - `" + int.member.guild.id + "`", inline: true })
        }
        else {
            cmdEmbed.addFields({ name: "Local: ", value: "DM", inline: true })
        }

        client.log.webhook.send({ embeds: [cmdEmbed] }).catch(err => { })
    }
}