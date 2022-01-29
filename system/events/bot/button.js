const time = require("luxon").DateTime

module.exports = {
    name: "button",
    type: "bot",
    execute: async (client, comp, cmd) => {
        client.cache.updateCnt("button")

        let idioma
        try {
            idioma = comp.lang.replace("-", "").toUpperCase()
        }
        catch (err) {
            idioma = "Nenhum idioma configurado"
        }

        const buttonEmbed = new client.Discord.MessageEmbed()
            .setTitle("Botão: `" + cmd + "`")
            .setAuthor({ name:  `${comp.user.tag} - ${comp.user.id}`, iconURL: comp.user.displayAvatarURL() })
            .setDescription("**Info no botão:**\n" + "`" + comp.customId + "`")
            .addField("Idioma: ", "`" + idioma + "`", true)
            .setFooter({text:"Utilizado em: " + time.now(comp.createdTimestamp).setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ") + "(GMT -3)"})
            .setColor(client.settings.color)

        if (comp.guildId != null) {
            buttonEmbed.addField("Local: ", "`" + comp.member.guild.name + "` - `" + comp.member.guild.id + "`", true)
        }
        else {
            buttonEmbed.addField("Local: ", "DM", true)
        }

        client.log.webhook.send({ embeds: [buttonEmbed] })
        client.log.info(`Botão: ${cmd} utilizado por ${comp.user.tag}(${comp.user.id})`)
    }
}