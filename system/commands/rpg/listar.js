module.exports = class listar {
    constructor() {
        return {
            ownerOnly: false,
            name: "listar",
            fName: "Listar",
            fNameEn: "List",
            desc: 'Mostra o nome de todas as fichas que você possuí no BOT.',
            descEn: 'Shows the name of all the sheets you have in the BOT.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "listar", desc: `
    Este comando serve para ver o nome de todas as fichas que você criou

Ex: **${"/"}listar**`
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "listar", desc: `
    This command is to see the name of all the sheets you have created

    Ex: **${"/"}listar**`
            },
            run: this.execute,
            api: this.api
        }
    }
    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "ficha")
        int.deferReply({ ephemeral: secret })
            .then(() => {
                client.db.query(`select nomerpg from fichas where id = :id`, {
                    replacements: { id: int.user.id }
                })
                    .then(result => {
                        const fichas = new Array()
                        result[0].map(f => fichas.push(f.nomerpg))

                        const fichasU = new client.Discord.MessageEmbed()

                        if (fichas.length == 1) {
                            fichasU.setTitle(client.tl({ local: int.lang + "vf-embedTi1", qfichas: fichas.length }))
                            fichasU.setDescription(client.tl({ local: int.lang + "vf-embedDesc1", fichasUser: fichas }))
                        }
                        else if (fichas.length > 1) {
                            fichasU.setTitle(client.tl({ local: int.lang + "vf-embedTi2", qfichas: fichas.length }))
                            fichasU.setDescription(client.tl({ local: int.lang + "vf-embedDesc2", fichasUser: fichas }))
                        }
                        else {
                            return int.editReply(client.tl({ local: int.lang + "vf-fNE" }))
                        }

                        fichasU.setColor(client.settings.color)
                        fichasU.setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                        fichasU.setTimestamp()
                        return int.editReply({ embeds: [fichasU] })

                    })
                    .catch(err => client.log.error(err, true))
            })
    }
    async api(client, id) {
        var result = await client.db.query(`select nomerpg from fichas where id = :id`, {
            replacements: { id: id }
        })

        const fichas = new Array()
        result[0].map(f => fichas.push(f.nomerpg))

        return fichas
    }
}
