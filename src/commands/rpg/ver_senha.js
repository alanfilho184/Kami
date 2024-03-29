module.exports = class ver_senha {
    constructor() {
        return {
            ownerOnly: false,
            name: "versenha",
            nameEn: "viewpassword",
            fName: "Ver senha",
            fNameEn: "View password",
            desc: 'Visualize a senha de suas fichas.',
            descEn: 'View the password for your sheets.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "versenha", desc: `Com esse comando você pode ver a senha de suas fichas

                Compartilhe essa senha somente com quem você quiser que possa visualizar a sua ficha

                _Formato do comando:_
                **/versenha**
            
                Ex: **/versenha**`
            },
            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "versenha", desc: `With this command you can see the password for your sheets.

                Share this password only with those you want to be able to view your sheet.

                _Format of the command:_
                **/versenha**
            
                Ex: **/versenha**`
            },
            run: this.execute
        }
    }
    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(() => {
                client.db.query(`select nomerpg, senha from fichas where id = :id`, {
                    replacements: { id: int.user.id }
                })
                    .then(result => {
                        if (result[0].size == 0) {
                            return int.editReply({ content: client.tl({ local: int.lang + "verS-nFC" }) })
                        }

                        const fichas = new Map()
                        result[0].map(f => fichas.set(f.nomerpg, f.senha))

                        var embedTi = client.tl({ local: int.lang + "verS-embedTi" })
                        if (fichas.size > 1) {
                            embedTi = client.utils.replaceAll(embedTi, "$", "s")
                        }
                        else {
                            embedTi = client.utils.replaceAll(embedTi, "$", "")
                        }

                        const embedSenhas = new client.Discord.EmbedBuilder()
                            .setTitle(embedTi)
                            .setColor(parseInt(process.env.EMBED_COLOR))
                            .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                            .setTimestamp()

                        fichas.forEach((senha, nomerpg) => {
                            embedSenhas.addFields({name: nomerpg + ":", value: senha, inline: true})
                        })


                        return int.editReply({ embeds: [embedSenhas] })

                    })
            })
    }
}