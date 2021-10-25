const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const glob = require("glob")
const logs = require("../resources/scripts/logs.js")
const toMs = require("milliseconds-parser")()
const moment = require("moment-timezone")
const fs = require("fs");

module.exports = class MenuClient extends Client {

    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
            intents: 13825,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
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
        //this.startAPI() 

    }

    validate(options) {

        if (!options.token) throw ('Token not found in settings')
        if (!options.prefix) throw ('Prefix not found in settings')

        this.token = options.token
        this.prefix = options.prefix
        this.Discord = Discord

        console.log(options)
        this.settings = options

    }

    loadCommands() {
        this.commands = new Discord.Collection()

        try {
            var commands = glob.GlobSync("**/commands/**/*.js")

            commands = commands.found
            commands.forEach(cmd => {
                if (cmd.startsWith("system/commands/")) {
                    var cmdFunction = require("../../" + cmd)

                    var info = new cmdFunction()

                    this.commands.set(info.name, info)
                }
            })
        }
        catch (err) {
            logs.log.error(err)
        }

        logs.log.start("Comandos")

    }

    loadEvents() {
        var events = glob.GlobSync("**/events/**/*.js")
        events = events.found
        events.forEach(event => {
            let eventFunction = require("../../" + event)

            this.on(eventFunction.name, (...args) => { eventFunction.execute(this, ...args) })
            if (eventFunction.name == "messageCreate") {
                this.on("blacklist", (...args) => { eventFunction.blacklist(this, ...args) })
                this.on("varUpdate", (...args) => { eventFunction.disableCmd(this, ...args) })
            }
            logs.log.start("Evento: " + eventFunction.name)

        })
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

        process.on("uncaughtException", (err) => {
            logs.log.error(err, true)
        })
        process.on("unhandledRejection", (err) => {
            logs.log.error(err, true)
        })

        process.on("SIGTERM", (signal) => {
            fs.writeFileSync("log.txt", logs.logTxt())

            this.channels.fetch(this.settings.log).then(async (c) => {
                await c.send({ content: `Log completo - ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")}`, files: ["log.txt"] })
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
        const ml = require("../resources/translate/tl")
        const tl = new ml(this)

        this.tl = tl.tl
        logs.log.start("Multi-Idioma")
    }

    startup() {
        require("../resources/texts/pt").startup()
        this.resources = {
            pt: require("../resources/texts/pt"),
            en: require("../resources/texts/en"),
            assets: require("../resources/assets/assets")
        }

        const botStatus = require("../resources/scripts/botStatus")

        const BS = new botStatus({ client: this })

        this.botStatus = BS

        setInterval(() => {
            BS.updateBS(this)
        }, toMs.parse("1 minuto"))

        logs.log.start("Recursos gerais")
    }

    // startAPI() {
    //     require("./API.js").api(this)
    //     setTimeout(() => {
    //         require("./API.js").api(this)
    //     }, toMs.parse("1 hora"))
    // }

    async login(token = this.token) {
        super.login(token)
    }

}
