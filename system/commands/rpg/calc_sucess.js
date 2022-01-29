const { ToInteger } = require("es-abstract");

module.exports = class sucesso {
    constructor() {
        return {
            ownerOnly: false,
            name: "sucesso",
            fName: "Sucesso",
            fNameEn: "Sucess",
            desc: 'Calcula o sucesso de um atributo.',
            descEn: 'Calculates the sucess of an attribute.',
            args: [
                { name: "valor", desc: "Valor do atributo que deseja calcular (0 ~ 100).", type: "INTEGER", required: true, autocomplete: false }
            ],
            options: [],
            type: 1,
            helpPt: {
                title: "<:dadosAjuda:766790214030852137> " + "/" + "sucesso", desc: `
            Este comando serve para calcular o sucesso do seu dado baseado nas regras do sistema **Call of Cthulhu**
        
        _Formato do comando:_
        **${"/"}sucesso <valor>**
        
        Ex: **${"/"}sucesso 55**`
            },

            helpEn: {
                title: "<:dadosAjuda:766790214030852137> " + "/" + "sucesso", desc: `
            This command is used to calculate the success of your dice based on the rules of system **Call of Cthulhu**
        
        _Format of the command:_
        **${"/"}sucesso <value>**
        
        Ex: ${"/"}sucesso 55`
            },
            run: this.execute
        }
    }
    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "ficha")
        int.deferReply({ephemeral: secret})
            .then(() => {
                const args = client.utils.args(int)

                var valor = args.get("valor")

                if (valor.length > 20) return int.editReply(client.tl({ local: int.lang + "cs-mA" }))

                var valorO = valor
                valor = Number(valor)

                if (isNaN(valor) || valor < 0) {
                    return int.editReply(client.tl({ local: int.lang + "cs-vInv", valor: valorO }))
                }

                var valorDiv = valor
                var extremo = ToInteger(valorDiv * 0.20)
                var bom = ToInteger(valorDiv * 0.50)
                var normal = valor
                var falha = valor

                if (extremo == 0 && bom == 0 && normal == 0 && falha == 0) {
                    return int.editReply(client.tl({ local: int.lang + "cs-vInv", valor: valorO }))

                }
                else {
                    const sucessos = new client.Discord.MessageEmbed()

                    sucessos.setTitle(client.tl({ local: int.lang + "cs-embedTi", valor: valorO }))
                    sucessos.setColor(client.settings.color)
                    sucessos.setDescription(`
        ${client.tl({ local: int.lang + "cs-embedDescExt" })} **${extremo}**

        ${client.tl({ local: int.lang + "cs-embedDescBomPt1" })} **${bom}** ${client.tl({ local: int.lang + "cs-embedDescBomPt2" })} **${extremo}**

        ${client.tl({ local: int.lang + "cs-embedDescNor" })} **${normal}** ${client.tl({ local: int.lang + "cs-embedDescBomPt2" })} **${bom}**

        ${client.tl({ local: int.lang + "cs-embedDescFal" })} **${falha}**
    `)
                    sucessos.setFooter({text: client.resources.footer(), iconURL: client.user.displayAvatarURL()})
                    sucessos.setTimestamp()
                    int.editReply({ embeds: [sucessos] })
                }
            })
    }

}