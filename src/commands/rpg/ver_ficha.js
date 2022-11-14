module.exports = class ver_ficha {
    constructor() {
        return {
            ownerOnly: false,
            name: "verficha",
            fName: "Ver ficha",
            fNameEn: "View sheet",
            desc: 'Visualiza uma ficha de outro usuário.',
            descEn: 'View another user sheet\`s',
            args: [
                { name: "usuario", desc: "Usuário que deseja visualizar a ficha.", type: "USER", required: true, autocomplete: false },
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja visualizar.", type: "STRING", required: true, autocomplete: true },
                { name: "senha_da_ficha", desc: "Senha da ficha que deseja visualizar.", type: "STRING", required: true, autocomplete: false }
            ],
            options: [],
            type: 1,
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
            run: this.execute,
            autocomplete: this.autocomplete
        }
    }
    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(() => {
                const args = client.utils.args(int)

                const user = args.get("usuario")
                const nomerpg = args.get("nome_da_ficha")
                const senha = args.get("senha_da_ficha")

                if (user == int.user.id) {
                    return int.editReply({ content: client.tl({ local: int.lang + "verF-fU" }) })
                }

                client.cache.getFicha(user, nomerpg)
                    .then(ficha => {
                        if (ficha == undefined) {
                            return int.editReply({ content: client.tl({ local: int.lang + "verF-nFE", nomerpg: nomerpg }), ephemeral: true })
                        }
                        else {
                            if (ficha.senha != senha) {
                                return int.editReply({ content: client.tl({ local: int.lang + "verF-sI", nomerpg: nomerpg }), ephemeral: true })
                            }
                            else {
                                client.users.fetch(user)
                                    .then(fProp => {
                                        var infoProp = int
                                        infoProp.user = fProp
                                        const reply = client.commands.get("enviar").create(client, infoProp, ficha)

                                        return int.editReply({ embeds: reply, ephemeral: true })
                                    })
                            }
                        }
                    })
            })
    }
    autocomplete(client, int) {
        const options = int.options._hoistedOptions

        options.forEach(opt => {
            if (opt.name == "nome_da_ficha" && opt.focused) {
                try {
                    const fichasUser = client.cache.getFichasUser(options[0].value)

                    if (fichasUser.length >= 1) {
                        const find = client.utils.matchNomeFicha(opt.value, fichasUser)
                        const data = new Array()

                        find.forEach(f => {
                            data.push({ name: f, value: f })
                        })

                        int.respond(data)
                    }
                }
                catch (err) { }
            }
        })
    }
}