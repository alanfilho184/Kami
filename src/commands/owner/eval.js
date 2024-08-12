const { inspect } = require('util')

module.exports = class evaluate {
    constructor() {
        return {
            ownerOnly: true,
            name: "eval",
            fName: "Evaluate",
            desc: 'Executa códigos.',
            type: 3,
            run: this.execute
        }
    }

    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(async () => {

                if (int.user.id == process.env.OWNER) {
                    var msg = int.options._hoistedOptions[0].message

                    msg.delete()

                    const evalEmbed = new client.Discord.EmbedBuilder()
                        .setColor(parseInt(process.env.EMBED_COLOR))

                    const codeEmbed = new client.Discord.EmbedBuilder()
                        .setColor(parseInt(process.env.EMBED_COLOR))
                        .setDescription("```js\n" + msg.content + "```")
                        .setTitle("Código:")

                    try {
                        var ping = Date.now()
                        var r = await eval(msg.content)
                        ping = Date.now() - ping

                        var code = typeof r == "string" ? r : inspect(r, { depth: 99 })
                        var result = `\`\`\`js\n${String(code).slice(0, 4000) + (code.length >= 4000 ? '...' : '')}\n\`\`\``

                        // var settings = client.utils.objToMap(process.env)
                        // settings.forEach((s) => { result = client.utils.replaceAll(result, s, "*") })

                        evalEmbed
                            .setDescription(result)
                            .setFooter({ text: `Tempo de execução: ${ping} ms`, iconURL: client.user.displayAvatarURL() })
                            .setTitle("Resultado:")
                            .setTimestamp()

                        int.editReply({ embeds: [codeEmbed, evalEmbed] })
                    }
                    catch (err) {
                        ping = Date.now() - ping

                        client.log.error(err)

                        err = inspect(err, { depth: 99 })
                        var error = `\`\`\`js\n${String(err).slice(0, 4000) + (err.length >= 4000 ? '...' : '')}\n\`\`\``

                        var settings = client.utils.objToMap(process.env)
                        settings.forEach((s) => { error = client.utils.replaceAll(error, s, "*") })

                        evalEmbed
                            .setDescription(error)
                            .setFooter({ text: `Tempo de execução: ${ping} ms`, iconURL: client.user.displayAvatarURL() })
                            .setTitle("Erro:")
                            .setTimestamp()

                        int.editReply({ embeds: [codeEmbed, evalEmbed] })
                    }

                }
                else {
                    return int.editReply({ content: client.tl({ local: int.lang + "onMsg-cmdBarrado" }) })
                }

            })

    }
}
