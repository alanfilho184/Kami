const time = require("luxon").DateTime

module.exports = class sugestao {
    constructor() {
        return {
            ownerOnly: false,
            name: "sugestao",
            fName: "Sugestão",
            fNameEn: "Suggestion",
            desc: 'Envia uma mensagem para a equipe do BOT.',
            descEn: 'Sends a message to the BOT\'s team.',
            args: [
                { name: "mensagem", desc: "A mensagem que deja enviar para a equipe.", type: "STRING", required: true }
            ],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "sugestão (bug, report, duvida, suporte)", desc: `
            Esse comando serve para mandar um report de bug ou sugestão para o meu criador, também serve para tirar duvidas, mas, tenha paciencia, não tem uma equipe por trás de mim é só uma pessoa para fazer tudo. Para usar o comando basta seguir o exemplo:
        
            _Formato do comando:_
            **${"/"}sugestão <mensagem>**
            Ex: **${"/"}sugestão Oi, corrige todos os problemas do bot (são muitos)**
            
            Claro, se você disser o que é o problema fica mais fácil de corrigir.`},

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "sugestão (bug, report, question, support)", desc: `This command is used to send a bug report or suggestion to my creator, it's also used to remove questions, but, be patient, there's not a team behind me is just one person to do everything. To use the command just follow the example:
        
            _Format of the command:_
            **${"/"}sugestão <message>**
            Ex: **${"/"}sugestão Hi, fix all the bot problems (there are many)**
            
            Of course, if you say what the problem is it becomes easier to fix.`},
            run: this.execute
        }
    }

    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(() => {
                const args = client.utils.args(int)
                const mensagem = args.get("mensagem")

                const embed = new client.Discord.MessageEmbed()
                    .setAuthor(`${int.user.tag} | ${int.user.id}`, int.user.displayAvatarURL())
                    .setTitle("Mensagem recebida")
                    .setDescription(mensagem)
                    .setColor(client.settings.color)
                    .setFooter("Mensagem recebida em: " + time.now({ zone: "America/Fortaleza" }).toFormat("dd/MM/y | HH:mm:ss ") + "(GMT -3)")

                client.log.embed(embed, true, "sugestao")
                    .then((msg) => msg.pin())

                int.editReply({ content: client.tl({ local: int.lang + "sugestao-mEnv" }) })

                return
            })
    }
}
