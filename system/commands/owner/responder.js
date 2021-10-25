
module.exports = class responder {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: true,
            },
            name: "responder",
            cat: "Responder",
            desc: 'Envia uma mensagem a um usuário.',
            aliases: ["responder"],
            run: this.execute
        }
    }

    execute(client, msg) {
        if (msg.author.id == client.settings.owner) {

            const id = msg.author.id
            const cmd = msg.content.replace(`${client.prefix}responder`, "")
            const respId = cmd.slice(1, 19)
            const respMsg = cmd.slice(20, 9999999999999999)

            client.users.fetch(respId).then(user => user.send(respMsg))
            msg.reply(`Pronto, mensagem enviada!`)
        }
        else {
            msg.reply(client.tl({ local: msg.lang + "onMsg-cmdBarrado" }))
        }
    }
}
