module.exports = class insanidade {
    constructor() {
        return {
            ownerOnly: false,
            name: "insanidade",
            fName: "Insanidade",
            fNameEn: "Insanity",
            desc: 'Envia uma insanidade para um personagem, temporaria ou permanente.',
            descEn: 'Sends a insanity to a character, temporary or permanent.',
            args: [],
            options: [{
                name: "tipo",
                required: true,
                type: "STRING",
                desc: "Opções para o comando.",
                choices: [
                    { name: "Temporária", return: "temporaria" },
                    { name: "Permanente", return: "permanente" }
                ],
            }],
            type: 1,
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
    execute(client, int) {
        const args = client.utils.args(int)

        const secret = client.utils.secret(client.cache.get(int.user.id), "insan")

        int.deferReply({ ephemeral: secret })
            .then(() => {

                const inTemp = client.resources[int.lang.replace("-", "")].inTemp
                const inPerm = client.resources[int.lang.replace("-", "")].inPerm

                if (args.get("tipo") == "permanente") {
                    var qPerm = inPerm.length

                    var result = client.utils.dice(qPerm)

                    const insPerm = new client.Discord.MessageEmbed()
                        .setTitle(client.tl({ local: int.lang + "ins-embedPermTi" }))
                        .setFooter(client.resources.footer(), client.user.displayAvatarURL())
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

                        insPerm.setDescription(`${client.tl({ local: int.lang + "ins-embedPermDesc2inPt1" })} **${inPerm[result1 - 1]}** ${client.tl({ local: int.lang + "ins-embedPermDesc2inPt2" })} **${inPerm[result2 - 1]}**`)

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

                        insPerm.setDescription(`${client.tl({ local: int.lang + "ins-embedPermDesc3in" })} **${inPerm[result1 - 1]}**, **${inPerm[result2 - 1]}** ${client.tl({ local: int.lang + "ins-embedPermDesc2inPt2" })} **${inPerm[result3 - 1]}**`)

                    }
                    else {
                        insPerm.setDescription(`${client.tl({ local: int.lang + "ins-embedPermDesc" })} **${inPerm[client.utils.dice(qPerm) - 1]}**`)
                    }

                    return int.editReply({ embeds: [insPerm] })
                }

                if (args.get("tipo") == "temporaria") {
                    var qTemp = inTemp.length
                    var result = client.utils.dice(qTemp)

                    const insTemp = new client.Discord.MessageEmbed()
                        .setTitle(client.tl({ local: int.lang + "ins-embedTempTi" }))
                        .setColor(client.settings.color)
                        .setDescription(`${client.tl({ local: int.lang + "ins-embedTempDesc" })} **${inTemp[result - 1]}**`)
                        .setFooter(client.resources.footer(), client.user.displayAvatarURL())
                        .setTimestamp()

                    return int.editReply({ embeds: [insTemp] })

                }
            })
    }
}