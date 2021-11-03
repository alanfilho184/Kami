module.exports = class renomear {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "renomear",
            cat: "Renomear",
            catEn: "Rename",
            desc: 'Renomeia uma ficha que você já tenha criada no BOT.',
            descEn: 'Rename a sheet you already have created on the BOT\'s.',
            aliases: ["renomear", "rename"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "renomear", desc: `Com esse comando você pode alterar o nome de uma ficha sua já criada

    _Formato do comando:_
    **${"/"}renomear <nomeAntigo> <nomeNovo>**

    Ex: **${"/"}renomar RPG_Kami Novo_RPG_Kami**`
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "renomear", desc: `
    With this command you can change the name of a sheet of yours already created

    _Format of the command:_
    **${"/"}renomear <nameOld> <nameNew>**
    Ex: **${"/"}renomear RPG_Kami RPG_Kami2**`
            },
            run: this.execute
        }
    }
    execute(client, msg) {
        var args = client.utils.args(msg)

        if (!args[0]) { return msg.reply(client.tl({ local: msg.lang + "rf-nArg" })) }
        if (!args[1]) { return msg.reply(client.tl({ local: msg.lang + "rf-nNomeRpg" })) }

        client.db.query(`select * from fichas where id = '${msg.author.id}' and nomerpg = '${args[0]}'`)
            .then(result => {
                if (result[0] == "") { return msg.reply(client.tl({ local: msg.lang + "rf-nFE", nomeRpg: args[0] })) }
                else {
                    client.db.query(`update fichas set nomerpg = '${args[1]}' where id = '${msg.author.id}' and nomerpg = '${args[0]}'`)
                        .then(() => { return msg.reply(client.tl({ local: msg.lang + "rf-fRenomeada", nomeRpg: args[0], novoNomeRpg: args[1] })) })
                        .catch(err => { client.log.error(err, true) })
                }
            })
            .catch(err => client.log.error(err, true))
    }
}