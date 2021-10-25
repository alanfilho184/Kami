const moment = require("moment-timezone")

module.exports = class ping {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: 'ping',
            cat: 'Ping',
            catEn: 'Ping',
            desc: 'Mostra os tempos de resposta do BOT.',
            descEn: 'Shows the BOT\'s response times.',
            aliases: ['ping'],
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "ping", desc: `Esse comando serve para verificar o tempo de resposta de diversos locais do BOT
                
                Ex: **${"$prefix$"}ping**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "ping", desc: `This command is used to check the response time of several locations of the BOT
            
                Ex: **${"$prefix$"}ping**`
            },
            run: this.execute
        };
    }

    async execute(client, msg) {
        const botMsg = await msg.reply({ content: "<a:loading:772142378563534888> " + client.tl({ local: msg.lang + "botI-gI" }), ephemeral: true })

        var dbPing = moment().valueOf()
        await client.db.query("select 1")
            .then(() => {
                dbPing = moment().valueOf() - dbPing
            })

        const pingEmbed = new client.Discord.MessageEmbed()
            .setColor(client.settings.color)
            .setFooter(`${moment().year()} © Kami`, client.user.displayAvatarURL())
            .addField("BOT:", "`" + Math.round(msg.ping) + " ms`", true)
            .addField("API:", "`" + Math.round(client.ws.ping) + " ms`", true)
            .addField("DB: ", "`" + Math.round(dbPing) + " ms`", true)
            .setTitle("Ping:")

        botMsg.edit({ content: null, embeds: [pingEmbed] })

    }

}
