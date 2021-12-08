module.exports = class renomear {
    constructor() {
        return {
            ownerOnly: false,
            name: "renomear",
            fName: "Renomear",
            fNameEn: "Rename",
            desc: 'Renomeia uma ficha que você já tenha criada no BOT.',
            descEn: 'Rename a sheet you already have created on the BOT\'s.',
            args: [
                { name: "atual_nome_da_ficha", desc: "Nome da ficha que deseja renomear.", type: "STRING", required: true },
                { name: "novo_nome_da_ficha", desc: "Novo nome da ficha.", type: "STRING", required: true },
            ],
            options: [],
            type: 1,
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
    execute(client, int) {
        int.deferReply()
            .then(() => {
                const args = client.utils.args(int)

                const nomeRpgAtual = args.get("atual_nome_da_ficha")
                var nomeRpgNovo = args.get("novo_nome_da_ficha")

                try { nomeRpgNovo = nomeRpgNovo.normalize("NFD").replace(/[^\w\s]/gi, '') } catch (err) { }
                try { nomeRpgNovo = nomeRpgNovo.replace("'", '') } catch { }

                client.db.query(`select * from fichas where id = '${int.user.id}' and nomerpg = '${nomeRpgAtual}'`)
                    .then(result => {
                        if (result[0] == "") { return int.editReply(client.tl({ local: int.lang + "rf-nFE", nomeRpg: nomeRpgAtual })) }
                        else {
                            client.db.query(`update fichas set nomerpg = '${nomeRpgNovo}' where id = '${int.user.id}' and nomerpg = '${nomeRpgAtual}'`)
                                .then(() => { return int.editReply(client.tl({ local: int.lang + "rf-fRenomeada", nomeRpg: nomeRpgAtual, novoNomeRpg: nomeRpgNovo })) })
                                .catch(err => { client.log.error(err, true) })
                        }
                    })
                    .catch(err => client.log.error(err, true))
            })
    }
}