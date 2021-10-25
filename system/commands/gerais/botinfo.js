const moment = require("moment-timezone")
const ac = require("ascii-table")
const pidusage = require("pidusage")
const os = require("os-utils")

module.exports = class botinfo {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "botinfo",
            cat: "Botinfo",
            catEn: "Botinfo",
            desc: 'Mostra informações técnicas e links sobre o BOT.',
            descEn: 'Show technical information and links related with the BOT.',
            aliases: ["bi"],
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "botinfo", desc: `Este comando serve para ver informações do bot, como links relacionados ao bot, uso de recursos e quantidade de usuários
        
            Ex: **${"$prefix$"}botinfo**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "botinfo", desc: `This command is used to see bot information, such as links related to the bot, resource usage and amount of users
        
            Ex: **${"$prefix$"}botinfo**`
            },
            run: this.execute
        }
    }

    async execute(client, msg) {
        const botMsg = await msg.reply({ content: "<a:loading:772142378563534888> " + client.tl({ local: msg.lang + "botI-gI" }) })

        var count = 0

        client.guilds.cache.map(guild => { count += guild.memberCount })

        const table = new ac("Kami Info")

        var dbPing = moment().valueOf()
        await client.db.query("select 1")
            .then(() => {
                dbPing = moment().valueOf() - dbPing
            })

        const owner = await client.users.fetch(client.settings.owner)

        var stats = await pidusage(process.pid)

        const ram = stats.memory / 1024 / 1024

        const commands = client.cache.getCount()

        var uptime = process.uptime();
        var days = Math.floor((uptime % 31536000) / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var minutes = Math.floor((uptime % 3600) / 60);
        var seconds = Math.round(uptime % 60);
        var botuptime =
            (days > 0 ? days == 1 ? days + " dia " : days + " dias " : "")
            + (hours > 0 ? hours == 1 ? hours + " hora " : hours + " horas " : "")
            + (minutes > 0 ? minutes == 1 ? minutes + " minuto " : minutes + " minutos " : "")
            + (seconds > 0 ? seconds == 1 ? seconds + " segundo " : seconds + " segundos " : "")

        table
            .addRow(`${client.tl({ local: msg.lang + "botI-fStatusT1" })}`, `${stats.cpu.toFixed(2)} %`)
            .addRow(`${client.tl({ local: msg.lang + "botI-fStatusT2" })}`, `${ram.toFixed(2)} MB`)
            .addRow(`${client.tl({ local: msg.lang + "botI-fStatusRT" })}`, `${(os.totalmem() / 1024 - os.freemem() / 1024).toFixed(1)} GB / ${(os.totalmem() / 1024).toFixed(1)} GB`)
            .addRow("Ping", `BOT: ${Math.round(msg.ping)} ms - ` + `API: ${Math.round(client.ws.ping)} ms - ` + `DB: ${Math.round(dbPing)} ms`)
            .addRow(`${client.tl({ local: msg.lang + "botI-fStatusT4" })}`, `${client.guilds.cache.size}`)
            .addRow(`${client.tl({ local: msg.lang + "botI-fStatusT5" })}`, `${count}`)
            .addRow(`${client.tl({ local: msg.lang + "botI-fCmd" })}`, `${client.tl({ local: msg.lang + "botI-cmdAI" })} ${commands.today} - Total: ${commands.total}`)
            .addRow(`${client.tl({ local: msg.lang + "botI-uptime" })}`, botuptime)


        const botIEmbed = new client.Discord.MessageEmbed()
        botIEmbed.setTitle(client.tl({ local: msg.lang + "botI-fAu" }) + owner.tag)
        botIEmbed.setColor(client.settings.color)
        botIEmbed.setDescription("```\n" + table.toString() + "```")
        botIEmbed.setTimestamp(Date.now())
        botIEmbed.setFooter(`${new Date().getFullYear()} © Kami`, client.user.displayAvatarURL())


        const bSup = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "botI-f2V" }))
            .setURL("https://discord.com/invite/9rqCkFB")

        const bVote = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "botI-f3V" }))
            .setURL("https://botsparadiscord.com.br/bots/716053210179043409")

        const bInv = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "botI-f4V" }))
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=716053210179043409&permissions=${client.settings.permissions}&scope=bot%20applications.commands`)



        botMsg.edit({ content: null, embeds: [botIEmbed], components: [{ type: 1, components: [bSup, bVote, bInv] }] })



    }
}