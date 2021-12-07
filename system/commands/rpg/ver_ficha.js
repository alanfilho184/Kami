// Em Desenvolvimento 

module.exports = class ver_ficha {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "verficha",
            cat: "Ver ficha",
            catEn: "View sheet",
            desc: 'Visualiza uma ficha de outro usuário.',
            descEn: 'View another user sheet\`s',
            aliases: ["vf", "vs", "ver", "view"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "verficha", desc: `Com esse comando você pode visualizar uma ficha de outro usuário
                
                Para ter a senha da ficha, você precisará pedir ao proprietário da ficha

                _Formato do comando:_
                **/verficha <@Usuário/ID> <nome_da_ficha> <senha>**
            
                Ex: **/verficha <@!716053210179043409> RPG_Kami xxxxxxxxxx**`
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "verficha", desc: `With this command you can view a sheet owned by another user.
                
                To get the password for the sheet, you will need to ask the owner of the sheet.

                _Format of the command:_
                **/verficha <@User/ID> <sheet_name> <password>**
            
                Ex: **/verficha <@!716053210179043409> RPG_Kami xxxxxxxxxx**`
            },
            run: this.execute
        }
    }
    execute(client, msg) {
        if (msg.channel.type != "DM" && msg.slash == false) {
            msg.delete()
            return msg.channel.send({content: client.tl({local: msg.lang+"verF-dm/", msg: msg})})
        }
        else {
            const args = client.utils.args(msg)
            if (msg.slash == true) {
                client.cache.getFicha(args[0], args[1])
                    .then(ficha => {
                        if (ficha == undefined) {
                            return msg.pureReply({content: client.tl({local: msg.lang+"verF-nFE", nomeRpg: args[1]}), ephemeral: true})
                        }
                        else {
                            if (ficha.senha != args[2]) {
                                return msg.pureReply({content: client.tl({local: msg.lang+"verF-sI", nomeRpg: args[1]}), ephemeral: true})
                            }
                            else {
                                client.users.fetch(args[0])
                                    .then(fProp => {
                                        var infoProp = msg
                                        infoProp.author = fProp
                                        const reply = client.commands.get("enviar").create(client, infoProp, args[1], ficha, false)
                                        const embedsArray = Object.values(reply)

                                        return msg.pureReply({ embeds: embedsArray, ephemeral: true })
                                    })
                            }
                        }
                    })
            }
            else {
                if (args[0] == undefined) {
                    return msg.reply({content: client.tl({local: msg.lang+"verF-nArg"})})
                }
                if (args[1] == undefined) {
                    return msg.reply({content: client.tl({local: msg.lang+"verF-nArg1"})})
                }
                if (args[2] == undefined) {
                    return msg.reply({content: client.tl({local: msg.lang+"verF-nArg2"})})
                }

                client.users.fetch(args[0])
                    .then(fProp => {

                        if (fProp == undefined) {
                            return msg.reply({content: client.tl({local: msg.lang+"verF-nUE"})})
                        }
                        else {
                            client.cache.getFicha(fProp.id, args[1])
                                .then(ficha => {
                                    if (ficha == undefined) {
                                        return msg.reply({content: client.tl({local: msg.lang+"verF-nFUE", cmd: fProp.tag, nomeRpg: args[1]})})
                                    }
                                    else {
                                        if (ficha.senha != args[2]) {
                                            return msg.reply({content: client.tl({local: msg.lang+"verF-sI", nomeRpg: args[1]})})
                                        }
                                        else {
                                            var infoProp = msg
                                            infoProp.author = fProp
                                            const reply = client.commands.get("enviar").create(client, infoProp, args[1], ficha, false)
                                            const embedsArray = Object.values(reply)

                                            return msg.reply({ embeds: embedsArray })
                                        }
                                    }
                                })
                        }
                    })
                    .catch(err => {
                        return msg.reply({content: client.tl({local: msg.lang+"verF-nUE"})})
                    })
            }
        }

    }
}