const { ToInteger } = require("es-abstract");

module.exports = class sucesso {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "sucesso",
            cat: "Sucesso",
            catEn: "Sucess",
            desc: 'Calcula o sucesso de um atributo.',
            descEn: 'Calculates the sucess of an attribute.',
            aliases: ["sucessos", "sucess"],
            helpPt: {
                title: "<:dadosAjuda:766790214030852137> " + "$prefix$" + "sucesso", desc: `
            Este comando serve para calcular o sucesso do seu dado baseado nas regras do sistema **Call of Cthulhu**
        
        _Formato do comando:_
        **${"$prefix$"}sucesso <valor>**
        
        Ex: **${"$prefix$"}sucesso 55**`
            },

            helpEn: {
                title: "<:dadosAjuda:766790214030852137> " + "$prefix$" + "sucess", desc: `
            This command is used to calculate the success of your dice based on the rules of system **Call of Cthulhu**
        
        _Format of the command:_
        **${"$prefix$"}sucess <value>**
        
        Ex: ${"$prefix$"}sucess 55`
            },
            run: this.execute
        }
    }
    execute(client, msg) {
        var args = client.utils.args(msg)

        var valor = args[0]
        if (!valor) return msg.reply(client.tl({ local: msg.lang + "cs-nArg" }))

        if (valor.length > 20) return msg.reply(client.tl({ local: msg.lang + "cs-mA" }))

        const footer = client.resources[msg.lang.replace("-", "")].footer(client, msg)

        var valorO = valor
        valor = Number(valor)

        if (isNaN(valor) || valor < 0) {
            return msg.reply(client.tl({ local: msg.lang + "cs-vInv", valor: valorO }))
        }

        var valorDiv = valor
        var extremo = ToInteger(valorDiv * 0.20)
        var bom = ToInteger(valorDiv * 0.50)
        var normal = valor
        var falha = valor

        if (extremo == 0 && bom == 0 && normal == 0 && falha == 0) {
            return msg.reply(client.tl({ local: msg.lang + "cs-vInv", valor: valorO }))

        }
        else {
            const sucessos = new client.Discord.MessageEmbed()

            sucessos.setTitle(client.tl({ local: msg.lang + "cs-embedTi", valor: valorO }))
            sucessos.setColor(client.settings.color)
            sucessos.setDescription(`
        ${client.tl({ local: msg.lang + "cs-embedDescExt" })} **${extremo}**

        ${client.tl({ local: msg.lang + "cs-embedDescBomPt1" })} **${bom}** ${client.tl({ local: msg.lang + "cs-embedDescBomPt2" })} **${extremo}**

        ${client.tl({ local: msg.lang + "cs-embedDescNor" })} **${normal}** ${client.tl({ local: msg.lang + "cs-embedDescBomPt2" })} **${bom}**

        ${client.tl({ local: msg.lang + "cs-embedDescFal" })} **${falha}**
    `)
            sucessos.setFooter(footer, client.user.displayAvatarURL())
            sucessos.setTimestamp()
            msg.reply({ embeds: [sucessos] })
        }
    }
}