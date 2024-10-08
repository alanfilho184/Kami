const time = require('luxon').DateTime;
const ac = require('ascii-table');
const pidusage = require('pidusage');
const os = require('os-utils');

module.exports = class botinfo {
    constructor() {
        return {
            ownerOnly: false,
            name: 'botinfo',
            nameEn: 'botinfo',
            fName: 'Botinfo',
            fNameEn: 'Botinfo',
            desc: 'Mostra informações técnicas e links sobre o BOT.',
            descEn: 'Show technical information and links related with the BOT.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: '<:outrosAjuda:766790214110019586> ' + '/' + 'botinfo',
                desc: `Este comando serve para ver informações do bot, como links relacionados ao bot, uso de recursos e quantidade de usuários
        
            Ex: **${'/'}botinfo**`
            },

            helpEn: {
                title: '<:outrosAjuda:766790214110019586> ' + '/' + 'botinfo',
                desc: `This command is used to see bot information, such as links related to the bot, resource usage and amount of users
        
            Ex: **${'/'}botinfo**`
            },
            run: this.execute
        };
    }

    async execute(client, int) {
        const secret = client.utils.secret(await client.cache.get(int.user.id), 'geral');
        await int.deferReply({ ephemeral: secret });

        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
        ];

        const results = await Promise.all(promises);

        const table = new ac(`Kami - Shard: ${client.shard.ids[0]}`);

        var dbPing = time.now().toMillis();
        await client.db.query('select 1').then(() => {
            dbPing = time.now().toMillis() - dbPing;
        });

        const owner = await client.users.fetch(process.env.OWNER);

        var stats = await pidusage(process.pid);

        const ram = stats.memory / 1024 / 1024;

        const commands = await client.cache.getCount();

        var uptime = process.uptime();
        var days = Math.floor((uptime % 31536000) / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var minutes = Math.floor((uptime % 3600) / 60);
        var seconds = Math.round(uptime % 60);
        var botuptime =
            (days > 0 ? (days == 1 ? days + ' dia ' : days + ' dias ') : '') +
            (hours > 0 ? (hours == 1 ? hours + ' hora ' : hours + ' horas ') : '') +
            (minutes > 0 ? (minutes == 1 ? minutes + ' minuto ' : minutes + ' minutos ') : '') +
            (seconds > 0 ? (seconds == 1 ? seconds + ' segundo ' : seconds + ' segundos ') : '');

        table
            .addRow(`${client.tl({ local: int.lang + 'botI-fStatusT1' })}`, `${stats.cpu.toFixed(2)} %`)
            .addRow(`${client.tl({ local: int.lang + 'botI-fStatusT2' })}`, `${ram.toFixed(2)} MB`)
            .addRow(
                `${client.tl({ local: int.lang + 'botI-fStatusRT' })}`,
                `${(os.totalmem() / 1024 - os.freemem() / 1024).toFixed(1)} GB / ${(os.totalmem() / 1024).toFixed(
                    1
                )} GB`
            )
            .addRow(
                'Ping',
                `BOT: ${Math.round(int.ping)} ms - ` +
                    `API: ${Math.round(client.ws.ping)} ms - ` +
                    `DB: ${Math.round(dbPing)} ms`
            )
            .addRow(
                `${client.tl({ local: int.lang + 'botI-fStatusT4' })}`,
                `${results[0].reduce((acc, guildCount) => acc + guildCount, 0)}`
            )
            .addRow(
                `${client.tl({ local: int.lang + 'botI-fStatusT5' })}`,
                `${results[1].reduce((acc, memberCount) => acc + memberCount, 0)}`
            )
            .addRow(
                `${client.tl({ local: int.lang + 'botI-fCmd' })}`,
                `${client.tl({ local: int.lang + 'botI-cmdAI' })} ${commands.today} - Total: ${commands.total}`
            )
            .addRow(
                `${client.tl({ local: int.lang + 'botI-fBt' })}`,
                `${client.tl({ local: int.lang + 'botI-cmdAI' })} ${commands.buttonsToday} - Total: ${
                    commands.buttonsTotal
                }`
            )
            .addRow(`${client.tl({ local: int.lang + 'botI-uptime' })}`, botuptime);

        const botIEmbed = new client.Discord.EmbedBuilder();
        botIEmbed.setTitle(client.tl({ local: int.lang + 'botI-fAu' }) + owner.tag);
        botIEmbed.setColor(parseInt(parseInt(process.env.EMBED_COLOR)));
        botIEmbed.setDescription('```\n' + table.toString() + '```');
        botIEmbed.setTimestamp(Date.now());
        botIEmbed.setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() });

        const bSup = new client.Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + 'botI-f2V' }))
            .setURL('https://kamiapp.com.br/suporte');

        const bVote = new client.Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + 'botI-f3V' }))
            .setURL('https://botsparadiscord.com.br/bots/716053210179043409');

        const bInv = new client.Discord.ButtonBuilder()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + 'botI-f4V' }))
            .setURL(`https://kamiapp.com.br/convite`);

        int.editReply({
            content: null,
            embeds: [botIEmbed],
            components: [{ type: 1, components: [bSup, bVote, bInv] }]
        });
    }
};
