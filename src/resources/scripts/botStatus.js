const moment = require('moment-timezone');
const ac = require('ascii-table');
const os = require(`os-utils`);
const toMs = require('milliseconds-parser')();
const pidusage = require('pidusage');
const DBInfo = new Object();

var info = {
    serverCount: 130,
    userCount: 6049,
    fichasCount: 1195,
    commandsToday: 0,
    commandsTotal: 29971,
    buttonsTotal: 0,
    buttonsToday: 0,
    inviteLink:
        'https://discord.com/api/oauth2/authorize?client_id=716053210179043409&permissions=388160&scope=bot%20applications.commands',
    oldInfo: true
};

module.exports = class botStatus {
    constructor(options = {}) {
        this.client = options.client;

        this.getDB();
        setInterval(async () => {
            await this.getDB();
        }, toMs.parse('1 hora'));
    }

    async getDB() {
        var dbSize = await this.client.db.query(`SELECT pg_database_size('${process.env.DB_URI.split('/')[3]}');`);

        var ping = moment().valueOf();
        var dbFichas = await this.client.db.query(`select nomerpg from fichas`);
        ping = moment().valueOf() - ping;

        DBInfo.size = dbSize[0];
        DBInfo.fichas = dbFichas[0];
        DBInfo.ping = ping;
        return DBInfo;
    }

    async updateBS(client) {
        var year = new Date().getFullYear();

        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
        ];

        const results = await Promise.all(promises);

        var dbSize = DBInfo.size[0].pg_database_size;
        var dbFichas = DBInfo.fichas;

        const botStatus = new client.Discord.EmbedBuilder();

        var qFichas = dbFichas.length;

        var uptime = process.uptime();
        var days = Math.floor((uptime % 31536000) / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var minutes = Math.floor((uptime % 3600) / 60);
        var seconds = Math.round(uptime % 60);
        var botuptime =
            (days > 0 ? (days == 1 ? days + ' dia ' : days + ' dias ') : '') +
            (hours > 0 ? (hours == 1 ? hours + ' hora ' : hours + ' horas ') : '') +
            (minutes > 0 ? (minutes == 1 ? minutes + ' minuto ' : minutes + ' minutos ') : '');

        const table = new ac('Kami');

        const stats = await pidusage(process.pid);

        const ram = stats.memory / 1024 / 1024;

        const commands = client.cache.getCount();

        info = {
            serverCount: results[0].reduce((acc, guildCount) => acc + guildCount, 0),
            userCount: results[1].reduce((acc, memberCount) => acc + memberCount, 0),
            fichasCount: qFichas,
            commandsToday: commands.today,
            commandsTotal: commands.total,
            buttonsTotal: commands.buttonTotal,
            buttonsToday: commands.buttonToday,
            ping: client.ws.ping,
            dbSize: dbSize,
            dbPing: DBInfo.ping,
            inviteLink: `https://discord.com/api/oauth2/authorize?client_id=716053210179043409&permissions=${process.env.PERMISSIONS}&scope=bot%20applications.commands`,
            oldInfo: false
        };

        table
            .addRow(`Uso de CPU`, `${stats.cpu.toFixed(2)} %`)
            .addRow(`Uso de RAM`, `${ram.toFixed(2)} MB`)
            .addRow(
                `RAM Total`,
                `${(os.totalmem() / 1024 - os.freemem() / 1024).toFixed(1)} GB / ${(os.totalmem() / 1024).toFixed(
                    1
                )} GB`
            )
            .addRow('Ping', `API: ${Math.round(client.ws.ping)} ms - ` + `DB: ${Math.round(DBInfo.ping)} ms`)
            .addRow('Uso do DB', (dbSize / 1e6).toFixed(1) + ' MB')
            .addRow('Fichas Criadas', `${qFichas} Fichas`)
            .addRow('Fichas no Cache', `${client.cache.evalSync('fichas.length()')}`)
            .addRow('Fichas IRT no Cache', `${client.cache.evalSync('irt.length()')}`)
            .addRow('', '')
            .addRow(`Servidores`, `${info.serverCount}`)
            .addRow(`Usuários`, `${info.userCount}`)
            .addRow(`Comandos`, `Após iniciar: ${commands.today} - Total: ${commands.total}`)
            .addRow(`Botões`, `Após iniciar: ${commands.buttonsToday} - Total: ${commands.buttonsTotal}`)
            .addRow('', '')
            .addRow('Versão do BOT', 'v' + require('../../../package.json').version)
            .addRow('Node.js', process.version)
            .addRow('Discord.js', 'v' + require('../../../package.json').dependencies['discord.js'].replace('^', ''))
            .addRow('', '')
            .addRow(`Tempo Online`, botuptime);

        botStatus.setAuthor({ name: 'Status atual do BOT' });
        botStatus.setDescription('```\n' + table.toString() + '```');
        botStatus.setFooter({ text: `${year} © Kami`, iconURL: client.user.avatarURL() });
        botStatus.setTimestamp();
        botStatus.setColor(parseInt(process.env.EMBED_COLOR));

        if (client.user.id == '716053210179043409') {
            client.shard.broadcastEval(
                async c => {
                    const channel = c.channels.cache.get('772970777787236352');

                    if (channel) {
                        const message = await channel.messages.fetch('772971275903303721');
                        if (message) {
                            message.edit({ embeds: [JSON.parse(JSON.stringify(info))] });
                        } else {
                            return null;
                        }
                    }
                },
                {
                    context: JSON.stringify(info)
                }
            );
        } else {
            client.shard.broadcastEval(
                async (c, ctx) => {
                    const channel = c.channels.cache.get('784542287329886239');

                    if (channel) {
                        const message = await channel.messages.fetch('784543009982644245');
                        if (message) {
                            message.edit({ embeds: [JSON.parse(ctx)] });
                        } else {
                            return null;
                        }
                    }
                },
                {
                    context: JSON.stringify(botStatus)
                }
            );
        }
    }

    api() {
        return info;
    }
};
