// Em Desenvolvimento 

module.exports = class resetar_senha {
    constructor() {
        return {
            ownerOnly: false,
            name: "resetarsenha",
            fName: "Resetar senha",
            fNameEn: "Reset password",
            desc: 'Resete a senha de uma ficha sua já criada.',
            descEn: 'Reset the password for a sheet you have already created.',
            args: [
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja resetar a senha.", type: "STRING", required: true },
            ],
            options: [],
            type: 1,
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
    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(() => {
                const args = client.utils.args(int)
                const nomeRpg = args.get("nome_da_ficha")

                if (args.size == 0) {
                    return int.editReply({ content: client.tl({ local: int.lang + "rS-nArg" }) })
                }
                else {
                    client.db.query(`select id, nomerpg, senha from fichas where id = '${int.user.id}' and nomerpg = '${nomeRpg}' `)
                        .then(r => {
                            if (r[0].length == 0) {
                                return int.editReply({ content: client.tl({ local: int.lang + "rS-nFE", nomeRpg: nomeRpg }) })
                            }
                            else {
                                const novaSenha = client.utils.gerarSenha()
                                client.cache.updateFicha(int.user.id, nomeRpg, "senha", novaSenha)
                                    .then(r => {
                                        return int.editReply({ content: client.tl({ local: int.lang + "rS-sR", nomeRpg: nomeRpg, cmd: novaSenha }) })
                                    })
                            }
                        })
                }
            })
    }
}