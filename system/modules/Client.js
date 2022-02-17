const { Client } = require('discord.js');
const Discord = require('discord.js');
const glob = require("fast-glob")
const logs = require("../resources/scripts/logs.js")
const toMs = require("milliseconds-parser")()
const fs = require("fs");
const time = require("luxon").DateTime

module.exports = class MenuClient extends Client {

    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
            intents: 13825,
            restTimeOffset: 0,
        })

        this.validate(options);
        this.setLog()
        this.setUtils()
        this.setDB(options)
        this.loadCommands()
        this.loadEvents()
        this.setCache()
        this.setTl()
        this.startup()
        this.startAPI()

    }

    validate(options) {
        if (!options.prefix) throw ('Prefix not found in settings')

        this.token = options.token
        this.prefix = options.prefix
        this.Discord = Discord
        this.settings = options

    }

    loadCommands() {
        this.commands = new Discord.Collection()

        try {
            var commands = glob.sync(["**/commands/**/*.js", "!node_modules", "!events"])

            commands.forEach(cmd => {
                if (cmd.startsWith("system/commands/")) {
                    var cmdFunction = require("../../" + cmd)

                    var info = new cmdFunction()

                    if (info.name != "coletar") {
                        this.commands.set(info.name, info)
                    }
                }
            })
        }
        catch (err) {
            logs.log.error(err)
        }

        logs.log.start("Comandos")
    }

    loadEvents() {
        var events = glob.sync(["**/events/**/*.js", "!node_modules", "!commands"])

        events.forEach(event => {
            let eventFunction = require("../../" + event)

            this.on(eventFunction.name, (...args) => { eventFunction.execute(this, ...args) })
            if (eventFunction.name == "interactionCreate") {
                this.on("varUpdate", (...args) => { eventFunction.disableCmd(this, ...args) })
            }
            else if (eventFunction.name == "componentHandler") {
                this.on("passInt", (...args) => { eventFunction.passInt(this, ...args) })
            }
        })

        logs.log.start("Eventos")
    }

    setUtils() {
        const Utils = require('./Utils.js')
        const utils = new Utils({ client: this })
        this.utils = utils
        logs.log.start("Utils")
    }

    setDB(options) {
        const { Sequelize } = require('sequelize');

        const conStr = {
            database: options.dbName,
            username: options.dbUsername,
            password: options.dbPassword,
            host: options.dbHost,
            port: 5432,
            dialect: "postgres",
            logging: false,

        }

        if (this.prefix == "k!") {
            conStr["dialectOptions"] = {
                ssl: {
                    require: false,
                    rejectUnauthorized: false
                }
            }
        }

        const db = new Sequelize(conStr);

        this.db = db
        logs.log.start("Database")

    }

    setLog() {
        this.log = logs.log

        const logWebhook = new this.Discord.WebhookClient({ id: this.settings.webhookID, token: this.settings.webhookToken });
        this.log.webhook = logWebhook

        process.on("uncaughtException", (err) => {
            if (err == "TypeError: Cannot read property 'send' of null") {
                process.exit(1)
            }
            else if(err != "DiscordAPIError: Unknown interaction"){
                this.emit("err", err, true)
            }
            logs.log.error(err, true)
            //logStack.set(err, err)


        })

        process.on("unhandledRejection", (err) => {
            if (err == "TypeError: Cannot read property 'send' of null") {
                process.exit(1)
            }
            else if(err != "DiscordAPIError: Unknown interaction"){
                this.emit("err", err, true)
            }
            logs.log.error(err, true)
            //logStack.set(err, err)
        })

        process.on("SIGTERM", (signal) => {
            fs.writeFileSync("log.txt", logs.logTxt())

            this.channels.fetch(this.settings.log).then(async (c) => {
                await c.send({ content: `Log completo - ${time.now({ zone: "America/Fortaleza" }).toFormat("dd/MM/y | HH:mm:ss ")}`, files: ["log.txt"] })
                process.exit(0)
            })

        })

    }

    setCache() {
        const cacheMaker = require("../resources/config/cache")
        const cache = new cacheMaker(this)

        const whitelistMaker = require("../resources/config/whitelist")
        const whitelist = new whitelistMaker(this)

        this.cache = cache
        this.whitelist = whitelist
    }

    setTl() {
        this.resources = {
            "pt-": require("../resources/texts/pt"),
            "en-": require("../resources/texts/en"),
            assets: require("../resources/assets/assets"),
            msgs: require("../resources/messages/msgs.json")
        }

        this.resources.footer = this.resources["pt-"].footer

        const ml = require("../resources/messages/msgHandler")
        const tl = new ml(this)

        this.tl = tl.tl
        logs.log.start("Multi-Idioma")
    }

    startup() {
        const botStatus = require("../resources/scripts/botStatus")

        const BS = new botStatus({ client: this })

        this.botStatus = BS

        setTimeout(() => BS.updateBS(this), 10000)
        setInterval(() => {
            BS.updateBS(this)
        }, toMs.parse("1 minuto"))

        logs.log.start("Recursos gerais")
    }

    startAPI() {
        require("./api/app").api(this)

        if (this.settings.deploy == "production") {

            const postApi = require("./postInfo")
            const API = new postApi(this)

            setTimeout(() => {
                API.postBotinfo()
                API.postCommands()
            }, toMs.parse("30 segundos"))

            setInterval(() => {
                API.postBotinfo()
                API.postCommands()
            }, toMs.parse("30 minutos"))
        }
    }

    async login(token = this.token) {
        super.login(token)
    }

}