const time = require("luxon").DateTime;
var firstS = true

var blacklist = new Object()

const cmdConfig = new Object({
    disableCmds: new Array(),
    reason: new Object()
})

module.exports = {
    name: "autocompleteHandler",
    type: "bot",
    execute: async (client, int) => {
        if (firstS) { client.emit("blacklist"); firstS = false }
        if(int.deferred) return

        int.ping = time.now().ts - int.createdTimestamp
        int.lang = client.utils.getLang(int)

        try {
            if (blacklist[int.user.id].banAtual) {
                if (blacklist[int.user.id].duracaoBan <= time.now().ts) {
                    var banUser = blacklist[int.user.id]
                    client.cache.updateBl(int.user.id, { bans: banUser.bans, banAtual: null, duracaoBan: null })
                }
                else {
                    return
                }
            }
        }
        catch (err) {
            if (err == "TypeError: Cannot read property 'duracaoBan' of undefined") return
        }

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
    blacklist: (client) => {
        blacklist = client.cache.getBl()
        client.log.warn("blacklist atualizada no evento AutoComplete")
        return
    },
    disableCmd: (client, info) => {
        cmdConfig.disableCmds = info.disable.cmds
        cmdConfig.reason = info.disable.reason
    }
}