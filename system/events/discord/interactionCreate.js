const time = require("luxon").DateTime;
var firstS = true

var blacklist = new Object()

const cmdConfig = new Object({
    disableCmds: new Array(),
    reason: new Object()
})

module.exports = {
    name: "interactionCreate",
    type: "djs",
    execute: async (client, int) => {
        if (firstS) { client.emit("blacklist"); firstS = false }
        if ((int.isMessageComponent())) { return client.emit("componentHandler", int) }
        if ((int.isContextMenu())) { return client.emit("contextMenuHandler", int) }
        if (!int.isCommand()) { return }

        int.ping = time.now().ts - int.createdTimestamp
        int.lang = client.utils.getLang(int)

        try {
            if (blacklist[int.user.id].banAtual) {
                if (blacklist[int.user.id].duracaoBan <= moment().valueOf()) {
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
            return int.reply({ content: client.tl({ local: int.lang + "onMsg-cmdBarrado" }), ephemeral: true })
        }
        else {
            if (cmdConfig.disableCmds.includes(cmd.name)) {
                const disableEmbed = new client.Discord.MessageEmbed()
                    .setTitle(client.tl({ local: int.lang + "onMsg-cmdDsbTi" }))
                    .setColor(client.settings.color)
                    .setDescription(client.tl({ local: int.lang + "onMsg-cmdDsbDesc", cmd: cmdConfig.reason[cmd.name][int.lang] }))
                    .setFooter(client.resources[int.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
                    .setTimestamp()
                return int.reply({ embeds: [disableEmbed], ephemeral: true })
            }
            else {
                cmd.run(client, int)
                client.emit("cmd", int, cmd.name)
                const args = client.utils.argsString(int)
                client.log.info(`Comando: ${cmd.name} executado por ${int.user.tag}(${int.user.id}) ${args ? `- Args: ${args}` : ``}`)
            }
        }
    },
    blacklist: (client) => {
        blacklist = client.cache.getBl()
        client.log.warn("blacklist atualizada no evento Interaction")
        return
    },
    disableCmd: (client, info) => {
        cmdConfig.disableCmds = info.disable.cmds
        cmdConfig.reason = info.disable.reason
    }
}