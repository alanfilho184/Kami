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

        const buttonEmbed = new client.Discord.EmbedBuilder()
            .setTitle("Botão: `" + cmd + "`")
            .setAuthor({ name:  `${comp.user.tag} - ${comp.user.id}`, iconURL: comp.user.displayAvatarURL() })
            .setDescription("**Info no botão:**\n" + "`" + comp.customId + "`")
            .addFields({name: "Idioma: ", value: "`" + idioma + "`", inline: true})
            .setFooter({text:"Utilizado em: " + time.now(comp.createdTimestamp).setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ") + "(GMT -3)"})
            .setColor(parseInt(process.env.EMBED_COLOR))

        if (comp.guildId != null) {
            buttonEmbed.addFields({name: "Local: ", value: "`" + comp.member.guild.name + "` - `" + comp.member.guild.id + "`", inline: true})
        }
        else {
            buttonEmbed.addFields({name: "Local: ", value: "DM", inline: true})
        }

        client.log.webhook.send({ embeds: [buttonEmbed] }).catch(err => { })
        client.log.info(`Botão: ${cmd} utilizado por ${comp.user.tag}(${comp.user.id})`)
    }
}