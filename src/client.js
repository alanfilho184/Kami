const Discord = require('discord.js');
const glob = require('fast-glob');
const logs = require('./resources/scripts/logs.js');
const toMs = require('milliseconds-parser')();
const fs = require('fs');
const time = require('luxon').DateTime;

var errorStack = 0;
class MenuClient extends Discord.Client {
    constructor() {
        super({
            disableMentions: 'everyone',
            intents: 13825,
            restTimeOffset: 0
        });

        this.Discord = Discord;

        super.login(process.env.TOKEN);

        this.setLog();
        this.setUtils();
        this.setDB();
        this.loadCommands();
        this.loadComponents();
        this.loadEvents();
        this.setCache();
        this.setTl();
        this.postInfo();
        this.setWebSocket();
        this.startup();
    }

    loadCommands() {
        this.commands = new Discord.Collection();

        try {
            var commands = glob.sync(['**/commands/**/*.js', '!node_modules', '!events', '!components']);

            commands.forEach(cmd => {
                if (cmd.startsWith('src/commands/')) {
                    var cmdFunction = require('../' + cmd);

                    var info = new cmdFunction();

                    if (info.name != 'coletar' && info.ownerOnly == false) {
                        this.commands.set(info.nameEn, info);
                    } else if (info.name != 'coletar' && info.ownerOnly == true) {
                        this.commands.set(info.name, info);
                    }
                }
            });
        } catch (err) {
            logs.log.error(err);
        }

        logs.log.start('Comandos');
    }

    loadComponents() {
        this.components = new Discord.Collection();

        try {
            var components = glob.sync(['**/components/**/*.js', '!node_modules', '!events', '!commands']);

            components.forEach(comp => {
                if (comp.startsWith('src/components/')) {
                    var compFunction = require('../' + comp);

                    var info = new compFunction();

                    this.components.set(info.name, info);
                }
            });
        } catch (err) {
            logs.log.error(err);
        }

        logs.log.start('Componentes');
    }

    loadEvents() {
        var events = glob.sync(['**/events/**/*.js', '!node_modules', '!commands']);

        events.forEach(event => {
            let eventFunction = require('../' + event);

            this.on(eventFunction.name, (...args) => {
                eventFunction.execute(this, ...args);
            });
            if (eventFunction.name == 'interactionCreate') {
                // this.on('varUpdate', (...args) => {
                //     eventFunction.disableCmd(this, ...args);
                // });
            } else if (eventFunction.name == 'componentHandler') {
                this.on('passInt', (...args) => {
                    eventFunction.passInt(this, ...args);
                });
            }
        });

        logs.log.start('Eventos');
    }

    setUtils() {
        const Utils = require('./modules/utils.js');
        const utils = new Utils({ client: this });
        this.utils = utils;
        logs.log.start('Utils');
    }

    setDB() {
        const { Sequelize } = require('sequelize');

        function conStr(DATABASE_URL) {
            const dbURI = DATABASE_URL.replace('postgres://', '');
            const conStr = {
                database: dbURI.split('/')[1],
                username: dbURI.split(/@(?!.*@)/g)[0].split(':')[0],
                password: dbURI.split(/@(?!.*@)/g)[0].split(':')[1],
                host: dbURI.split(/@(?!.*@)/g)[1].split(':')[0],
                port: dbURI.split(/@(?!.*@)/g)[1].split(':')[1],
                logging: false,
                dialect: 'postgres'
            };

            if (process.env.NODE_ENV == 'production') {
                conStr['dialectOptions'] = {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                };
            }

            return conStr;
        }

        let conObj = conStr(process.env.DB_URI);

        if (process.env.DEPLOY == 'production') {
            conObj['dialectOptions'] = {
                ssl: {
                    require: false,
                    rejectUnauthorized: false
                }
            };
        }

        const db = new Sequelize(conObj);

        this.db = db;
        logs.log.start('Database');
    }

    setLog() {
        this.log = logs.log;

        const logWebhook = new this.Discord.WebhookClient({
            id: process.env.WEBHOOK_ID,
            token: process.env.WEBHOOK_TOKEN
        });
        this.log.webhook = logWebhook;

        const logWebhook2 = new this.Discord.WebhookClient({
            id: process.env.LOG_WEBHOOK_ID,
            token: process.env.LOG_WEBHOOK_TOKEN
        });

        this.log.logWebhook = logWebhook2;

        process.on('uncaughtException', err => {
            if (err == "TypeError: Cannot read property 'send' of null") {
                process.exit(1);
            } else if (err != 'DiscordAPIError: Unknown interaction') {
                this.emit('err', err, true);
            }
            logs.log.error(err, true);

            errorStack++;

            if (errorStack >= 15) {
                logs.log.error('Ocorreram 15 erros consecutivos, reiniciando o bot...');
                process.exit(1);
            }
        });

        process.on('unhandledRejection', err => {
            if (err == "TypeError: Cannot read property 'send' of null") {
                process.exit(1);
            } else if (err != 'DiscordAPIError: Unknown interaction') {
                this.emit('err', err, true);
            }
            logs.log.error(err, true);

            errorStack++;

            if (errorStack >= 15) {
                logs.log.error('Ocorreram 15 erros consecutivos, reiniciando o bot...');
                process.exit(1);
            }
        });

        process.on('SIGTERM', signal => {
            fs.writeFileSync('log.txt', logs.logTxt());

            this.shard.broadcastEval(
                async (c, ctx) => {
                    await c.log.logWebhook.send({
                        content: `Shard ${c.shard.ids[0]} `+ JSON.parse(ctx).message,
                        files: ['log.txt']
                    });

                    process.exit(0);
                },
                {
                    context: JSON.stringify({
                        message: `Log completo - ${time
                            .now({ zone: 'America/Fortaleza' })
                            .toFormat('dd/MM/y | HH:mm:ss ')}`
                    })
                }
            );
        });
    }

    setCache() {
        const cacheMaker = require('./resources/config/cache');
        const cache = new cacheMaker(this);

        const whitelistMaker = require('./resources/config/whitelist');
        const whitelist = new whitelistMaker(this);

        this.cache = cache;
        this.whitelist = whitelist;
    }

    setTl() {
        this.resources = {
            'pt-': require('./resources/texts/pt'),
            'en-': require('./resources/texts/en'),
            assets: require('./resources/assets/assets'),
            msgs: require('./resources/messages/msgs.json')
        };

        this.resources.footer = this.resources['pt-'].footer;

        const ml = require('./resources/messages/msgHandler');
        const tl = new ml(this);

        this.tl = tl.tl;
        logs.log.start('Multi-Idioma');
    }

    startup() {
        if (this.shard.ids[0] == 0) {
            const botStatus = require('./resources/scripts/botStatus');

            const BS = new botStatus({ client: this });

            this.botStatus = BS;
            try {
                setTimeout(() => {
                    BS.updateBS(this);

                    try {
                        this.shard
                            .broadcastEval(async c => {
                                const channel = await c.channels.cache.get('784035696414425108');

                                if (channel) {
                                    const message = await channel.messages.fetch('784039521645101066');
                                    if (message) {
                                        message.content = message.content
                                            .split('<@720128587289722902> <@716053210179043409>')
                                            .join('');
                                        message.content = message.content.split('```js').join('');
                                        message.content = message.content.split('```').join('');
                                        var msgConfig = JSON.parse(message.content);
                                        c.emit('varUpdate', msgConfig);

                                        return [c.shard.ids[0], message.content];
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return null;
                                }
                            })
                            .then(results => {
                                results.forEach(result => {
                                    if (Array.isArray(result)) {
                                        this.shard.broadcastEval(
                                            (c, result) => {
                                                result = JSON.parse(result);
                                                if (c.shard.ids[0] != result[0]) {
                                                    c.emit('varUpdate', result[1]);
                                                }
                                            },
                                            { context: JSON.stringify(result) }
                                        );
                                    }
                                });
                            })
                            .catch(console.error);
                    } catch (err) {}
                }, 10000);
                setInterval(() => {
                    BS.updateBS(this);
                }, toMs.parse('1 minuto'));
            } catch (err) {
                logs.log.error(err);
            }
        }

        logs.log.start('Recursos gerais');
    }

    postInfo() {
        if (process.env.DEPLOY == 'production' && this.shard.ids[0] == 0) {
            const postApi = require('./modules/postinfo.js');
            const API = new postApi(this);

            setTimeout(() => {
                API.postBotinfo();
                API.postCommands();
            }, toMs.parse('30 segundos'));

            setInterval(() => {
                API.postBotinfo();
                API.postCommands();
            }, toMs.parse('30 minutos'));
        }
    }

    setWebSocket() {
        const ws = require('./modules/websocket/server');
        new ws(this);
    }

    async login(token = process.env.TOKEN) {
        super.login(token);
    }
}

new MenuClient();
