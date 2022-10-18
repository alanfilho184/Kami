const time = require("luxon").DateTime;

const cmdConfig = new Object({
    disableCmds: new Array(),
    reason: new Object()
})

module.exports = {
    name: "autocompleteHandler",
    type: "bot",
    execute: async (client, int) => {
        if(int.deferred) return

        int.ping = time.now().ts - int.createdTimestamp
        int.lang = client.utils.getLang(int)

        if (!int.lang) { int.lang = "pt-" }

        const cmd = client.commands.get(int.commandName)

        if (cmd.ownerOnly && int.user.id != process.env.OWNER) {
            return
        }
        else {
            if (cmdConfig.disableCmds.includes(cmd.name)) {
                return
            }
            else {
                cmd.autocomplete(client, int)
            }
        }
    },
    disableCmd: (client, info) => {
        cmdConfig.disableCmds = info.disable.cmds
        cmdConfig.reason = info.disable.reason
    }
}