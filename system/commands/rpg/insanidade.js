const permAliases = ["perm", "permanente", "permanent"]
const tempAliases = ["temp", "temporario", "temporary", "temporaria"]

function secret(client, msg) {
    var userConfig = client.cache.get(msg.author.id)

    try {
        if (userConfig.insan == "true") {
            return true
        }
        if (userConfig.insan == "false" || userConfig.insan == null) {
            return false
        }
    }
    catch (err) {
        if (err == "TypeError: Cannot read property 'insan' of undefined") {
            return false
        }
    }
}

module.exports = class insanidade {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "insanidade",
            cat: "Insanidade",
            catEn: "Insanity",
            desc: 'Envia uma insanidade para um personagem, temporaria ou permanente.',
            descEn: 'Sends a insanity to a character, temporary or permanent.',
            aliases: ["ins", "insan", "insanity", "insanidade_config"],
            helpPt: {
                title: "<:dadosAjuda:766790214030852137> " + "/" + "insanidade (ins)", desc: `
    Gere um distúrbio psicológico aleatório para seu personagem 

Você pode escolher entre 2 tipos: _**temporario**_ e _**permanente**_

Ex: **${"/"}insanidade temporaria**
Ex²: **${"/"}insanidade permanente**

Você pode deixar esse comando secreto, assim, o bot sempre irá enviar o resultado na sua DM
Ex: **${"/"}config**
Esse comando irá desativar e ativar os comandos de insanidade secreta`},

            helpEn: {
                title: "<:dadosAjuda:766790214030852137> " + "/" + "insanidade (ins)", desc: `
    Generate a random psychological disorder for your character

    You can choose between 2 types: _**temporary**_ and _**permanent**_
    
    Ex: **${"/"}insanidade temporaria**
    Ex²: **${"/"}insanidade permanente**
    
    You can make this command secret, so the bot will always send the result in your DM
    Ex: **${"/"}config**
    This command will deactivate and activate the secret insanity commands`},
            run: this.execute
        }
    }
    execute(client, msg) {
        const args = client.utils.args(msg)

        if (!args[0]) return msg.reply(client.tl({ local: msg.lang + "ins-nArg" }))

        var secretInsan = secret(client, msg)

        if (secretInsan && !msg.slash) msg.delete()

        const inTemp = client.resources[msg.lang.replace("-", "")].inTemp
        const inPerm = client.resources[msg.lang.replace("-", "")].inPerm
        const footer = client.resources[msg.lang.replace("-", "")].footer()

        if (permAliases.includes(args[0])) {
            var qPerm = inPerm.length

            var result = client.utils.dice(qPerm)

            const insPerm = new client.Discord.MessageEmbed()
                .setTitle(client.tl({ local: msg.lang + "ins-embedPermTi" }))
                .setFooter(footer, client.user.displayAvatarURL())
                .setColor(client.settings.color)
                .setTimestamp()

            if (result == qPerm - 1) {
                var result1 = client.utils.dice(qPerm - 1)
                var result2 = client.utils.dice(qPerm - 1)

                if (result1 == result2) {
                    while (result1 == result2) {
                        result2 = client.utils.dice(qPerm - 1)
                    }
                }

                insPerm.setDescription(`${client.tl({ local: msg.lang + "ins-embedPermDesc2inPt1" })} **${inPerm[result1 - 1]}** ${client.tl({ local: msg.lang + "ins-embedPermDesc2inPt2" })} **${inPerm[result2 - 1]}**`)

            }
            else if (result == qPerm) {
                var allDif = false
                var result1 = client.utils.dice(qPerm)
                var result2 = client.utils.dice(qPerm)
                var result3 = client.utils.dice(qPerm)

                while (allDif == false) {
                    if (result1 == result2) {
                        result2 = client.utils.dice(qPerm - 1)
                    }
                    if (result1 == result3) {
                        result3 = client.utils.dice(qPerm - 1)
                    }
                    if (result2 == result3) {
                        result3 = client.utils.dice(qPerm - 1)
                    }
                    if (result1 != result2 && result1 != result3 && result2 != result3) {
                        allDif = true
                    }
                }

                insPerm.setDescription(`${client.tl({ local: msg.lang + "ins-embedPermDesc3in" })} **${inPerm[result1 - 1]}**, **${inPerm[result2 - 1]}** ${client.tl({ local: msg.lang + "ins-embedPermDesc2inPt2" })} **${inPerm[result3 - 1]}**`)

            }
            else {
                insPerm.setDescription(`${client.tl({ local: msg.lang + "ins-embedPermDesc" })} **${inPerm[client.utils.dice(qPerm) - 1]}**`)
            }

            if (secretInsan) {
                if (msg.slash) {
                    msg.pureReply({ embeds: [insPerm], ephemeral: true })
                }
                else {
                    msg.author.send({ embeds: [insPerm] })
                }
            }
            else {
                msg.reply({ embeds: [insPerm] })
            }
            return
        }

        if (tempAliases.includes(args[0])) {
            var qTemp = inTemp.length
            var result = client.utils.dice(qTemp)

            const insTemp = new client.Discord.MessageEmbed()
                .setTitle(client.tl({ local: msg.lang + "ins-embedTempTi" }))
                .setColor(client.settings.color)
                .setDescription(`${client.tl({ local: msg.lang + "ins-embedTempDesc" })} **${inTemp[result - 1]}**`)
                .setFooter(footer, client.user.displayAvatarURL())
                .setTimestamp()

            if (secretInsan) {
                if (msg.slash) {
                    msg.pureReply({ embeds: [insTemp], ephemeral: true })
                }
                else {
                    msg.author.send({ embeds: [insTemp] })
                }
            }
            else {
                msg.reply({ embeds: [insTemp] })
            }

            return
        }
    }
}