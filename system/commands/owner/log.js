const logs = require("../../resources/scripts/logs")
const fs = require("fs")

module.exports = class log {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: true,
            },
            name: "log",
            cat: "Log",
            desc: 'Log completo do BOT.',
            aliases: ["getLog"],
            run: this.execute
        }
    }

    async execute(client, msg) {
        fs.writeFileSync("log.txt", logs.logTxt())
        msg.reply({ content: "Aqui está o log de hoje:", files: ["log.txt"] })
    }
}
