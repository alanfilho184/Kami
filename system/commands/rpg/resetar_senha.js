// Em Desenvolvimento 

module.exports = class resetar_senha {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "resetarsenha",
            cat: "Resetar senha",
            catEn: "Reset password",
            desc: 'Resete a senha de uma ficha sua já criada.',
            descEn: 'Reset the password for a sheet you have already created.',
            aliases: ["resetpassword", "reset", "rp", "rs"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "resetarsenha", desc: `Com esse comando você pode resetar a senha de uma ficha sua já criada

                _Formato do comando:_
                **/resetarsenha <nome_da_ficha>**
            
                Ex: **/resetarsenha RPG_Kami**`
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "resetarsenha", desc: `With this command you can reset the password of a sheet you have already created

                _Format of the dommand:_
                **/resetarsenha <sheet_name>**
            
                Ex: **/resetarsenha RPG_Kami**`
            },
            run: this.execute
        }
    }
    execute(client, msg) {
        if (msg.channel.type != "DM" && msg.slash == false) {
            return msg.reply({ content: client.tl({ local: msg.lang + "rS-dm/" }) })
        }
        else {
            const args = client.utils.args(msg)
            if (args.length == 0) {
                return msg.reply({ content: client.tl({ local: msg.lang + "rS-nArg" }) })
            }
            else {
                client.db.query(`select id, nomerpg, senha from fichas where id = '${msg.author.id}' and nomerpg = '${args[0]}' `)
                    .then(r => {
                        if (r[0].length == 0) {
                            return msg.reply({ content: client.tl({ local: msg.lang + "rS-nFE", nomeRpg: args[0] }) })
                        }
                        else {
                            const novaSenha = client.utils.gerarSenha()
                            client.db.query(`update fichas set senha = '${novaSenha}' where id = '${msg.author.id}' and nomerpg = '${args[0]}' `)
                                .then(r => {
                                    if (msg.slash == true) {
                                        return msg.pureReply({ content: client.tl({ local: msg.lang + "rS-sR", nomeRpg: args[0], cmd: novaSenha }), ephemeral: true })
                                    }
                                    else {
                                        return msg.reply({ content: client.tl({ local: msg.lang + "rS-sR", nomeRpg: args[0], cmd: novaSenha }) })
                                    }
                                })
                        }
                    })
            }

        }
    }
}