const time = require("luxon").DateTime;

const warn = new Set()

module.exports = {
    name: "messageCreate",
    type: "djs",
    execute: async (client, msg) => {
        if (msg.author.bot) { return }
        if (client.utils.userOnBlacklist(msg.author.id)) { return }
        if (client.utils.mention(msg)) { return msg.reply(client.tl({ local: "pt-onMsg-mention" })) }
        if (warn.has(msg.author.id)) { return }
        if (!msg.content.startsWith(client.prefix)) {
            return
        }

        warn.add(msg.author.id)
        setTimeout(() => {
            warn.delete(msg.author.id)
        }, 60 * 60 * 1000)

        msg.lang = "pt-"

        const btLink = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "onMsg-btSlash" }))
            .setURL(`https://kamisite.herokuapp.com/tutoriais`)

        const btInfo = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "onMsg-btSlashInfo" }))

        if (msg.lang == "pt-") {
            btInfo.setURL(`https://support-dev.discord.com/hc/pt-br/articles/4404772028055`)
        }
        else {
            btInfo.setURL(`https://support-dev.discord.com/hc/en-us/articles/4404772028055`)
        }

        const btSup = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "botI-f2V" }))
            .setURL("https://discord.com/invite/9rqCkFB")

        return msg.channel.send({ content: `<@!${msg.author.id}>\n` + client.tl({ local: msg.lang + "onMsg-slash" }), components: [{ type: 1, components: [btLink, btSup, btInfo] }] })
    }
}

