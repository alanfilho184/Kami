const time = require("luxon").DateTime
const ac = require("ascii-table")
const pidusage = require("pidusage")
const os = require("os-utils")

module.exports = class botinfo {
    constructor() {
        return {
            ownerOnly: false,
            name: "botinfo",
            fName: "Botinfo",
            fNameEn: "Botinfo",
            desc: 'Mostra informações técnicas e links sobre o BOT.',
            descEn: 'Show technical information and links related with the BOT.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "botinfo", desc: `Este comando serve para ver informações do bot, como links relacionados ao bot, uso de recursos e quantidade de usuários
        
            Ex: **${"/"}botinfo**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "botinfo", desc: `This command is used to see bot information, such as links related to the bot, resource usage and amount of users
        
            Ex: **${"/"}botinfo**`
            },
            run: this.execute
        }
    }

    async execute(client, int) {
        await int.deferReply()
        var count = 0

        client.guilds.cache.map(guild => { count += guild.memberCount })

        const table = new ac("Kami Info")

        var dbPing = time.now().toMillis()
        await client.db.query("select 1")
            .then(() => {
                dbPing = time.now().toMillis() - dbPing
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
            .addRow(`${client.tl({ local: int.lang + "botI-fStatusT1" })}`, `${stats.cpu.toFixed(2)} %`)
            .addRow(`${client.tl({ local: int.lang + "botI-fStatusT2" })}`, `${ram.toFixed(2)} MB`)
            .addRow(`${client.tl({ local: int.lang + "botI-fStatusRT" })}`, `${(os.totalmem() / 1024 - os.freemem() / 1024).toFixed(1)} GB / ${(os.totalmem() / 1024).toFixed(1)} GB`)
            .addRow("Ping", `BOT: ${Math.round(int.ping)} ms - ` + `API: ${Math.round(client.ws.ping)} ms - ` + `DB: ${Math.round(dbPing)} ms`)
            .addRow(`${client.tl({ local: int.lang + "botI-fStatusT4" })}`, `${client.guilds.cache.size}`)
            .addRow(`${client.tl({ local: int.lang + "botI-fStatusT5" })}`, `${count}`)
            .addRow(`${client.tl({ local: int.lang + "botI-fCmd" })}`, `${client.tl({ local: int.lang + "botI-cmdAI" })} ${commands.today} - Total: ${commands.total}`)
            .addRow(`${client.tl({ local: int.lang + "botI-uptime" })}`, botuptime)


        const botIEmbed = new client.Discord.MessageEmbed()
        botIEmbed.setTitle(client.tl({ local: int.lang + "botI-fAu" }) + owner.tag)
        botIEmbed.setColor(client.settings.color)
        botIEmbed.setDescription("```\n" + table.toString() + "```")
        botIEmbed.setTimestamp(Date.now())
        botIEmbed.setFooter(`${new Date().getFullYear()} © Kami`, client.user.displayAvatarURL())


        const bSup = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "botI-f2V" }))
            .setURL("https://discord.com/invite/9rqCkFB")

        const bVote = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "botI-f3V" }))
            .setURL("https://botsparadiscord.com.br/bots/716053210179043409")

        const bInv = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "botI-f4V" }))
            .setURL(`https://kamibot.vercel.app/short/convite`)

        int.editReply({ content: null, embeds: [botIEmbed], components: [{ type: 1, components: [bSup, bVote, bInv] }] })
    }
}