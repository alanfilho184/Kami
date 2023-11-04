const time = require("luxon").DateTime;

const cmdConfig = new Object({
    disableCmds: new Array(),
    reason: new Object()
})

module.exports = {
    name: "interactionCreate",
    type: "djs",
    execute: async (client, int) => {
        if (client.utils.userOnBlacklist(int.user.id)) { return }
        if (int.type == 4) { return client.emit("autocompleteHandler", int) }
        if (int.type == 3) { return client.emit("componentHandler", int) }
        if ((int.isContextMenuCommand())) { return client.emit("contextMenuHandler", int) }
        if (!int.isChatInputCommand()) { return }

        int.ping = time.now().ts - int.createdTimestamp
        int.lang = client.utils.getLang(int)

        if (!int.lang) { int.lang = "pt-" }

        console.log(int.commandName)
        const cmd = client.commands.get(int.commandName)
        console.log(client.commands)

        if (cmd.ownerOnly && int.user.id != process.env.OWNER) {
            return int.reply({ content: client.tl({ local: int.lang + "onMsg-cmdBarrado" }), ephemeral: true })
        }
        else {
            if (cmdConfig.disableCmds.includes(cmd.name)) {
                const disableEmbed = new client.Discord.EmbedBuilder()
                    .setTitle(client.tl({ local: int.lang + "onMsg-cmdDsbTi" }))
                    .setColor(parseInt(process.env.EMBED_COLOR))
                    .setDescription(client.tl({ local: int.lang + "onMsg-cmdDsbDesc", cmd: cmdConfig.reason[cmd.name][int.lang] }))
                    .setFooter(client.resources[int.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
                    .setTimestamp()
                return int.reply({ embeds: [disableEmbed], ephemeral: true })
            }
            else {
                client.on("err", (err, logged) => {
                    if (int.deferred) {
                        if (int.replied) {
                            return
                        }
                        else {
                            return int.editReply({ content: client.tl({ local: int.lang + "intCreate-onErr" }), ephemeral: true })
                        }
                    }
                    else {
                        return int.reply({ content: client.tl({ local: int.lang + "intCreate-onErr" }), ephemeral: true })
                    }
                })

                cmd.run(client, int)
                client.emit("cmd", int, cmd.name)
                const args = client.utils.argsString(int)
                client.log.info(`Comando: ${cmd.name} executado por ${int.user.tag}(${int.user.id}) ${args ? `- Args: ${args}` : ``}`)
            }
        }
    },
    disableCmd: (client, info) => {
        cmdConfig.disableCmds = info.disable.cmds
        cmdConfig.reason = info.disable.reason
    }
}