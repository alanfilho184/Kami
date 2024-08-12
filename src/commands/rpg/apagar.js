async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class apagar {
    constructor() {
        return {
            ownerOnly: false,
            name: "apagar",
            nameEn: "delete",
            fName: "Apagar",
            fNameEn: "Delete",
            desc: 'Apaga uma ficha que já tenha sido criada.',
            descEn: 'Deletes a sheet that has already been created.',
            args: [
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja apagar.", type: "STRING", required: true, autocomplete: true },
            ],
            argsEn: [
                { name: "sheet_name", desc: "Name of the sheet you want to delete.", type: "STRING", required: true, autocomplete: true },
            ],
            options: [{
                name: "opções",
                required: false,
                type: "STRING",
                desc: "Opções para o comando.",
                choices: [
                    { name: "Somente desativar IRT para a ficha (a ficha é mantida).", return: "irt" }
                ],
            }],
            optionsEn: [{
                name: "options",
                required: false,
                type: "STRING",
                desc: "Options for the command.",
                choices: [
                    { name: "Just disable IRT for the sheet (the sheet is kept).", return: "irt" }
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
    async execute(client, int) {
        const secret = client.utils.secret(await client.cache.get(int.user.id), "ficha")
        int.deferReply({ ephemeral: secret })
            .then(() => {
                const args = client.utils.args(int)

                var nomerpg = args.get("sheet_name")
                var irt = args.get("options")
                if (!irt) { irt = "false" }

                try { nomerpg = nomerpg.replace(/[^\w\s]/gi, '') } catch { }

                client.db.query(`select * from fichas where id = :id and nomerpg = :nomerpg`, {
                    replacements: { id: int.user.id, nomerpg: nomerpg }
                })
                    .then(async result => {
                        if (result[0] == "") { return int.editReply(client.tl({ local: int.lang + "af-fNE", nomerpg: nomerpg })) }
                        else {
                            if (irt.toLowerCase() == "irt") {
                                client.db.query(`select * from irt where id = :id and nomerpg = :nomerpg`, {
                                    replacements: { id: int.user.id, nomerpg: nomerpg }
                                })
                                    .then(async irt => {
                                        if (irt[0][0]) {

                                            await client.cache.getIrt(int.user.id, nomerpg)
                                                .then(async fichasIrt => {
                                                    for (var f of fichasIrt) {
                                                        const c = client.channels.cache.get(f.chid)
                                                        const m = await c.messages.fetch(f.msgid)

                                                        await m.edit({ components: [] })
                                                        await sleep(6000)
                                                    }
                                                })

                                            client.db.query(`delete from irt where id = :id and nomerpg = :nomerpg`, {
                                                replacements: { id: int.user.id, nomerpg: nomerpg }
                                            })
                                                .then(r => {
                                                    return int.editReply(client.tl({ local: int.lang + "af-deacIrt", nomerpg: nomerpg }))
                                                })
                                            await client.cache.deleteIrt(int.user.id, nomerpg)
                                        }
                                        else {
                                            return int.editReply(client.tl({ local: int.lang + "af-irtNF", nomerpg: nomerpg }))
                                        }
                                    })

                                return
                            }

                            const uniqueID = `${Date.now()}`
                            const bConf = new client.Discord.ButtonBuilder()
                                .setStyle(3)
                                .setLabel(client.tl({ local: int.lang + "bt-conf" }))
                                .setCustomId("conf|" + uniqueID)

                            const bCanc = new client.Discord.ButtonBuilder()
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
                                                client.db.query(`delete from fichas where id = :id and nomerpg = :nomerpg`, {
                                                    replacements: { id: int.user.id, nomerpg: nomerpg }
                                                })
                                                    .then(async () => {
                                                        client.emit("deleteFichaBot", int.user.id, nomerpg)
                                                        await client.cache.deleteFicha(int.user.id, nomerpg)
                                                        await client.cache.deleteFichaUser(int.user.id, nomerpg)

                                                        try {
                                                            const fPadrao = await client.cache.get(int.user.id).fPadrao

                                                            if (fPadrao == nomerpg) {
                                                                await client.cache.update(int.user.id, null, "fPadrao", false)
                                                            }
                                                        }
                                                        catch (err) { }

                                                        int.editReply({ content: client.tl({ local: int.lang + "af-fApg", nomerpg: nomerpg }), components: [] })
                                                            .then(async function () {
                                                                await client.cache.getIrt(int.user.id, nomerpg)
                                                                    .then(infoUIRT => {
                                                                        if (infoUIRT != "") {
                                                                            client.emit("apgFicha", { id: int.user.id, nomerpg: nomerpg })
                                                                        }
                                                                    })
                                                            })
                                                    })
                                                    .catch(err => { client.log.error(err, true) })
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

        options.forEach(async opt => {
            if (opt.name == "sheet_name" && opt.focused) {
                const fichasUser = await client.cache.getFichasUser(int.user.id)

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

