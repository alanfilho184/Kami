const moment = require("moment-timezone")


module.exports = class sugestao {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "sugestao",
            cat: "Sugestão",
            catEn: "Suggestion",
            desc: 'Envia uma mensagem para a equipe do BOT.',
            descEn: 'Sends a message to the BOT\'s team.',
            aliases: ["suggestion", "bug", "report", "duvida", "question", "support", "suporte"],
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "sugestão (bug, report, duvida, suporte)", desc: `
            Esse comando serve para mandar um report de bug ou sugestão para o meu criador, também serve para tirar duvidas, mas, tenha paciencia, não tem uma equipe por trás de mim é só uma pessoa para fazer tudo. Para usar o comando basta seguir o exemplo:
        
            _Formato do comando:_
            **${"$prefix$"}sugestão <mensagem>**
            Ex: **${"$prefix$"}sugestão Oi, corrige todos os problemas do bot(são muitos)**
            
            Claro, se você disser o que é o problema fica mais fácil de corrigir.`},

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "suggestion (bug, report, question, support)", desc: `This command is used to send a bug report or suggestion to my creator, it's also used to remove questions, but, be patient, there's not a team behind me is just one person to do everything. To use the command just follow the example:
        
            _Format of the command:_
            **${"$prefix$"}suggestion <message>**
            Ex: **${"$prefix$"}suggestion Hi, fix all the bot problems (there are many)**
            
            Of course, if you say what the problem is it becomes easier to fix.`},
            run: this.execute
        }
    }

    execute(client, msg) {
        const mensagem = msg.content.split(/ (.+)/)[1]

        if (mensagem == undefined) {
            msg.reply(client.tl({ local: msg.lang + "sugestao-nArg" }))
        }
        else {
            const embed = new client.Discord.MessageEmbed()

            embed
                .setAuthor(`${msg.author.tag} | ${msg.author.id}`, msg.author.displayAvatarURL())
                .setTitle("Mensagem recebida")
                .setDescription(mensagem)
                .setColor(client.settings.color)
                .setFooter("Mensagem recebida em: " + moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss ") + "(GMT -3)")

            client.log.embed(embed, true, "sugestao")
                .then((msg) => msg.pin())
            msg.reply(client.tl({ local: msg.lang + "sugestao-mEnv" }))
        }

        return
    }
}
