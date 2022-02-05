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

        const cmd = client.commands.get(int.commandName)

        if (cmd.ownerOnly && int.user.id != client.settings.owner) {
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