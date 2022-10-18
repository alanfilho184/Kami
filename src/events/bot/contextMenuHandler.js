const time = require("luxon").DateTime;

module.exports = {
    name: "contextMenuHandler",
    type: "bot",
    execute: async (client, int) => {

        int.ping = time.now().ts - int.createdTimestamp
        int.lang = client.utils.getLang(int)

        if (!int.lang) { int.lang = "pt-" }

        const cmd = client.commands.get(int.commandName)

        if (cmd.ownerOnly == true && int.user.id != process.env.OWNER) {
            return int.reply({ content: client.tl({ local: int.lang + "onMsg-cmdBarrado" }), ephemeral: true })
        }
        else {
            client.on("err", (err, logged) => {
                if (int.deferred) {
                    if (int.replied) {
                        return
                    }
                    else {
                        return int.editReply({content: client.tl({ local: int.lang + "intCreate-onErr"}), ephemeral: true})
                    }
                }
                else {
                    return int.reply({content: client.tl({ local: int.lang + "intCreate-onErr"}), ephemeral: true})
                }
            })
            
            cmd.run(client, int)
            client.emit("cmd", int, cmd.name)
            const args = client.utils.argsString(int)
            client.log.info(`Comando: ${cmd.name} executado por ${int.user.tag}(${int.user.id}) ${args ? `- Args: ${args}` : ``}`)
        }
    }
}