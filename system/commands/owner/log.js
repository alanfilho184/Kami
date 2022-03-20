const logs = require("../../resources/scripts/logs")
const fs = require("fs")

module.exports = class log {
    constructor() {
        return {
            ownerOnly: true,
            name: "log",
            fName: "Log",
            desc: 'Log completo do BOT.',
            args: [],
            options: [],
            type: 1,
            run: this.execute
        }
    }

    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(() => {
                fs.writeFileSync("log.txt", logs.logTxt())
                int.editReply({ content: "Aqui está o log de hoje:", files: ["log.txt"] })
            })
    }
}
