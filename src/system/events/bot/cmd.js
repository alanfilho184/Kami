var gSPerMap = new Map()
const moment = require("moment-timezone")
var firstS = true
var webhook = new Object()

module.exports = {
    name: "cmd",
    execute: async (client, msg, cmd) => {
        var Lang = msg.lang
        if (true) {
            client.cache.updateCnt()

            args = msg.content.split(/ (.+)/)[1] || "Nenhum argumento dado"
            try {
                idioma = Lang.replace("-", "").toUpperCase()
            }
            catch (err) {
                idioma = "Nenhum idioma configurado"
            }

            if (!msg.slash) { var attach = msg.attachments.map(a => { return a.attachment }) }
            const cmdEmbed = new client.Discord.MessageEmbed()
                .setTitle("Comando: `" + cmd + "`")
                .setAuthor(`${msg.author.tag} - ${msg.author.id}`, msg.author.displayAvatarURL())
                .setDescription("**Args:**\n" + "`" + args + "`")
                .addField("Idioma: ", "`" + idioma + "`", true)
                .setFooter("Executado em: " + moment(msg.createdTimestamp).tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss ") + "(GMT -3)")
                .setColor(client.settings.color)
            if (msg.channel.type == "GUILD_TEXT") cmdEmbed.addField("Local: ", "`" + msg.guild.name + "` - `" + msg.guild.id + "`", true)
            else cmdEmbed.addField("Local: ", "DM", true)

            if (msg.slash) { cmdEmbed.addField("Tipo:", "`" + "Slash command" + "`") }
            else { cmdEmbed.addField("Tipo:", "`" + "Prefix command" + "`") }

            if (attach != "" && !msg.slash) { cmdEmbed.addField("Anexo:", `${attach}`) }

            if (firstS == true) { webhook = new client.Discord.WebhookClient({id: client.settings.webhookID, token: client.settings.webhookToken}); firstS = false }
            webhook.send({ embeds: [cmdEmbed] })
        }

        if (msg.channel.type == "DM") {
            return
        }

        if (!gSPerMap[`${msg.author.id}${msg.guild.id}`]) {
            var permissions = new client.Discord.Permissions(BigInt(client.settings.permissions)).toArray()
            var channelPerms = msg.guild.me.permissionsIn(msg.channel).toArray()

            const perms = new Array()

            for (x in permissions) {
                for (y in channelPerms) {
                    if (permissions[x] == channelPerms[y]) {
                        perms.push(channelPerms[y])
                    }
                }
            }

            var missing = permissions.filter((i => a => a !== perms[i] || !++i)(0));

            if (missing.length != 0) {

                if (Lang == "pt-") {
                    var permMap = client.resources.pt.permissoes
                }
                if (Lang == "en-") {
                    var permMap = client.resources.en.permissoes
                }
                misPerms = "```fix\n"

                for (x in missing) {
                    misPerms += permMap.get(missing[x]) + "\n"
                }
                misPerms = misPerms + "```"

                msg.reply(client.tl({ local: msg.lang + "onMsg-mPermsTxt", valor: misPerms }))
                    .catch(err => { try { msg.author.send(client.tl({ local: msg.lang + "onMsg-mPerms", msg: msg, valor: misPerms })) } catch { } })

                gSPerMap[`${msg.author.id}${msg.guild.id}`] = true
            }
            else {
                return
            }
        }
    },
}