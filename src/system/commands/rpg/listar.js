module.exports = class listar {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "listar",
            cat: "Listar",
            catEn: "List",
            desc: 'Mostra o nome de todas as fichas que você possuí no BOT.',
            descEn: 'Shows the name of all the sheets you have in the BOT.',
            aliases: ["listar", "list", "verfichas"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "$prefix$" + "listar", desc: `
    Este comando serve para ver o nome de todas as fichas que você criou

Ex: **${"$prefix$"}listar**`
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "$prefix$" + "list", desc: `
    This command is to see the name of all the sheets you have created

    Ex: **${"$prefix$"}list**`
            },
            run: this.execute,
            api: this.api
        }
    }
    execute(client, msg) {
        client.db.query(`select nomerpg from fichas where id = '${msg.author.id}'`)
            .then(result => {
                const fichas = new Array()
                result[0].map(f => fichas.push(f.nomerpg))

                const fichasU = new client.Discord.MessageEmbed()

                if (fichas.length == 1) {
                    fichasU.setTitle(client.tl({ local: msg.lang + "vf-embedTi1", qfichas: fichas.length }))
                    fichasU.setDescription(client.tl({ local: msg.lang + "vf-embedDesc1", fichasUser: fichas }))
                }
                else if (fichas.length > 1) {
                    fichasU.setTitle(client.tl({ local: msg.lang + "vf-embedTi2", qfichas: fichas.length }))
                    fichasU.setDescription(client.tl({ local: msg.lang + "vf-embedDesc2", fichasUser: fichas }))
                }
                else {
                    return msg.reply(client.tl({ local: msg.lang + "vf-fNE" }))
                }

                fichasU.setColor(client.settings.color)
                fichasU.setFooter(client.resources[msg.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
                fichasU.setTimestamp()
                return msg.reply({ embeds: [fichasU] })

            })
            .catch(err => client.log.error(err, true))
    }
    async api(client, id) {
        var result = await client.db.query(`select nomerpg from fichas where id = '${id}'`)

        const fichas = new Array()
        result[0].map(f => fichas.push(f.nomerpg))

        return fichas
    }
}
