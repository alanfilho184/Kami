const { inspect } = require('util')

module.exports = class evaluate {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: true,
            },
            name: "eval",
            cat: "Evaluate",
            desc: 'Executa códigos.',
            aliases: ['evaluate', 'ev'],
            run: this.execute
        }
    }

    async execute(client, msg) {
        if (msg.author.id == client.settings.owner) {
            const evalEmbed = new client.Discord.MessageEmbed()
                .setColor(client.settings.color)

            const args = msg.content.replace(`${client.prefix}eval `, "")

            try {
                var ping = Date.now()
                var r = await eval(args)
                ping = Date.now() - ping

                var code = typeof r == "string" ? r : inspect(r, { depth: 99 })
                var result = `\`\`\`js\n${String(code).slice(0, 4000) + (code.length >= 4000 ? '...' : '')}\n\`\`\``

                var settings = client.utils.objToMap(client.settings)
                settings.forEach((s) => { result = client.utils.replaceAll(result, s, "*") })

                evalEmbed
                    .setDescription(result)
                    .setFooter(`Tempo de execução: ${ping} ms`, client.user.displayAvatarURL())
                    .setTitle("Resultado:")
                    .setTimestamp()

                msg.reply({ embeds: [evalEmbed] })
            }
            catch (err) {
                ping = Date.now() - ping

                client.log.error(err)
                
                err = inspect(err, { depth: 99 })
                var error = `\`\`\`js\n${String(err).slice(0, 4000) + (err.length >= 4000 ? '...' : '')}\n\`\`\``

                var settings = client.utils.objToMap(client.settings)
                settings.forEach((s) => { error = client.utils.replaceAll(error, s, "*") })

                evalEmbed
                    .setDescription(error)
                    .setFooter(`Tempo de execução: ${ping} ms`, client.user.displayAvatarURL())
                    .setTitle("Erro:")
                    .setTimestamp()

                msg.reply({ embeds: [evalEmbed] })
            }

        }
        else {
            return
        }


    }
}
