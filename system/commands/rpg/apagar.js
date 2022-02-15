async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class apagar {
    constructor() {
        return {
            ownerOnly: false,
            name: "apagar",
            fName: "Apagar",
            fNameEn: "Delete",
            desc: 'Apaga uma ficha que já tenha sido criada.',
            descEn: 'Deletes a sheet that has already been created.',
            args: [
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja apagar.", type: "STRING", required: true, autocomplete: true },
            ],
            options: [{
                name: "opções",
                required: false,
                type: "STRING",
                desc: "Opções para o comando.",
                choices: [
                    { name: "Desativar IRT para a ficha (a ficha é mantida).", return: "irt" }
                ],
            }],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "apagar", desc: `
    Este comando serve para caso não for mais utilizar a ficha, poder apagá-la

_Formato do comando:_
**${"/"}apagar <nome_da_ficha>**

Ex: **${"/"}apagar RPG_Kami**

Você também pode usar este comando pra desativar fichas IRT

Ex: **${"/"}apagar RPG_Kami irt**
`},
            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "apagar", desc: `
    This command is used in case of the sheet is not used anymore, to be able to delete it

    _Format of the command:_
    **${"/"}apagar <sheet_name>**

    Ex: **${"/"}apagar RPG_Kami**

    You can also use this command to deactivate IRT sheets

    Ex: **${"/"}apagar RPG_Kami irt**
`},
            run: this.execute,
            autocomplete: this.autocomplete
        }
    }
    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "ficha")
        int.deferReply({ ephemeral: secret })
            .then(() => {
                const args = client.utils.args(int)
                const beta = client.whitelist.get("beta")

                var nomerpg = args.get("nome_da_ficha")
                var irt = args.get("opções")
                if (!irt) { irt = "false" }

                try { nomerpg = nomerpg.replace(/[^\w\s]/gi, '') } catch { }

                client.db.query(`select * from fichas where id = '${int.user.id}' and nomerpg = '${nomerpg}'`)
                    .then(async result => {
                        if (result[0] == "") { return int.editReply(client.tl({ local: int.lang + "af-fNE", nomerpg: nomerpg })) }
                        else {
                            if (irt.toLowerCase() == "irt") {
                                client.db.query(`select * from irt where id = '${int.user.id}' and nomerpg = '${nomerpg}'`)
                                    .then(irt => {
                                        if (irt[0][0]) {

                                            client.cache.getIrt(int.user.id, nomerpg)
                                                .then(async fichasIrt => {
                                                    for (var f of fichasIrt) {
                                                        const c = client.channels.cache.get(f.chid)
                                                        const m = await c.messages.fetch(f.msgid)

                                                        await m.edit({ components: [] })
                                                        await sleep(6000)
                                                    }
                                                })

                                            client.db.query(`delete from irt where id = '${int.user.id}' and nomerpg = '${nomerpg}'`)
                                                .then(r => {
                                                    return int.editReply(client.tl({ local: int.lang + "af-deacIrt", nomerpg: nomerpg }))
                                                })
                                            client.cache.deleteIrt(int.user.id, nomerpg)
                                        }
                                        else {
                                            return int.editReply(client.tl({ local: int.lang + "af-irtNF", nomerpg: nomerpg }))
                                        }
                                    })

                                return
                            }

                            const uniqueID = `${Date.now()}`
                            const bConf = new client.Discord.MessageButton()
                                .setStyle(3)
                                .setLabel(client.tl({ local: int.lang + "bt-conf" }))
                                .setCustomId("conf|" + uniqueID)

                            const bCanc = new client.Discord.MessageButton()
                                .setStyle(4)
                                .setLabel(client.tl({ local: int.lang + "bt-canc" }))
                                .setCustomId("canc|" + uniqueID)

                            int.editReply({ content: client.tl({ local: int.lang + "af-cEF", nomerpg: nomerpg }), components: [{ type: 1, components: [bConf, bCanc] }] })
                                .then(async botmsg => {
                                    if (!int.inGuild()) { botmsg = await client.channels.fetch(int.channelId) }
                                    const filter = (interaction) => interaction.user.id === int.user.id && interaction.customId.split("|")[1] === uniqueID
                                    botmsg.awaitMessageComponent({ filter, time: 30000 })
                                        .then(interaction => {
                                            interaction.deferUpdate()
                                            const choice = interaction.customId.split("|")[0]

                                            if (choice == "conf") {
                                                client.db.query(`delete from fichas where id = '${int.user.id}' and nomerpg = '${nomerpg}'`)
                                                    .catch(err => { client.log.error(err, true) })
                                                    .then(() => {
                                                        client.cache.deleteFicha(int.user.id, nomerpg)
                                                        client.cache.deleteFichaUser(int.user.id, nomerpg)

                                                        int.editReply({ content: client.tl({ local: int.lang + "af-fApg", nomerpg: nomerpg }), components: [] })
                                                            .then(async function () {
                                                                client.cache.getIrt(int.user.id, nomerpg)
                                                                    .then(infoUIRT => {
                                                                        if (infoUIRT != "") {
                                                                            client.emit("apgFicha", { id: int.user.id, nomerpg: nomerpg })
                                                                        }
                                                                    })
                                                            })
                                                    })
                                            }
                                            else if (choice == "canc") {
                                                int.editReply({ content: client.tl({ local: int.lang + "af-fM", nomerpg: nomerpg }), components: [] })
                                            }
                                        })
                                        .catch(err => {
                                            if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                                return int.editReply({ content: client.tl({ local: int.lang + "af-sConfirm", nomerpg: nomerpg }), components: [] })
                                            }
                                            else {
                                                client.log.error(err, true)
                                            }
                                        })
                                })

                        }
                    })
                    .catch(err => { client.log.error(err, true) })
            })
    }
    autocomplete(client, int) {
        const options = int.options._hoistedOptions

        options.forEach(opt => {
            if (opt.name == "nome_da_ficha" && opt.focused) {
                const fichasUser = client.cache.getFichasUser(int.user.id)

                if (fichasUser.length >= 1) {
                    const find = client.utils.matchNomeFicha(opt.value, fichasUser)
                    const data = new Array()

                    find.forEach(f => {
                        data.push({ name: f, value: f })
                    })

                    int.respond(data)
                }
            }
        })
    }


}

