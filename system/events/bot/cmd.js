const time = require("luxon").DateTime
var firstS = true
var webhook = new Object()

module.exports = {
    name: "cmd",
    type: "bot",
    execute: async (client, int, cmd) => {
        client.cache.updateCnt()

        var Lang = int.lang

        args = client.utils.argsString(int) || "Nenhum argumento dado"
        
        try {
            idioma = Lang.replace("-", "").toUpperCase()
        }
        catch (err) {
            idioma = "Nenhum idioma configurado"
        }

        const cmdEmbed = new client.Discord.MessageEmbed()
            .setTitle("Comando: `" + cmd + "`")
            .setAuthor(`${int.user.tag} - ${int.user.id}`, int.user.displayAvatarURL())
            .setDescription("**Args:**\n" + "`" + args + "`")
            .addField("Idioma: ", "`" + idioma + "`", true)
            .setFooter("Executado em: " + time.now(int.createdTimestamp).setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ") + "(GMT -3)")
            .setColor(client.settings.color)

        if (int.guildId != null) {
            cmdEmbed.addField("Local: ", "`" + int.member.guild.name + "` - `" + int.member.guild.id + "`", true)
        }
        else {
            cmdEmbed.addField("Local: ", "DM", true)
        }

        if (firstS == true) {
            webhook = new client.Discord.WebhookClient({ id: client.settings.webhookID, token: client.settings.webhookToken });
            firstS = false
        }

        webhook.send({ embeds: [cmdEmbed] })
    }
}