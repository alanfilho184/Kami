const toMs = require("milliseconds-parser")()


module.exports = class addbl {
    constructor(){
        return{
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: true,
            },
            name: "addbl",
            cat: "addbl",
            desc: 'Altera a blacklist.',
            aliases: ['addbl', 'blacklist', 'bl'],
            run: this.execute
        }
    }

    async execute(client, msg) {
        args = client.utils.args(msg)

        const banid = msg.mentions.members.first() || args[0]

        if (!banid) {
            return msg.reply("id indefinido, não esquece <id> <bans> <tempBan | permaBan> <número tipo>")
        }

        var bans = args[1]

        if(!bans){
            return msg.reply("bans indefinido, não esquece <id> <bans> <tempBan | permaBan> <número tipo>")
        }

        var banAtual = args[2]

        if(!banAtual){
            return msg.reply("banAtual indefinido, não esquece <id> <bans> <tempBan | permaBan> <número tipo>")
        }

        var duracaoBan = toMs.parse(`${args[3]} ${args[4]}`)

        if(!duracaoBan){
            return msg.reply("duracão indefinida, não esquece <id> <bans> <tempBan | permaBan> <número tipo>")
        }


        client.cache.updateBl(banid, {bans: bans, banAtual: banAtual, duracaoBan: duracaoBan})
            .then(bl => {
                return msg.reply(bl)
            })

    }
}