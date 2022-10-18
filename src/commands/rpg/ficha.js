const { QueryTypes } = require('sequelize');

module.exports = class ficha {
    constructor() {
        return {
            ownerOnly: false,
            name: "ficha",
            fName: "Ficha",
            fNameEn: "Sheet",
            desc: 'Cria/edita uma ficha.',
            descEn: 'Create/edit a sheet.',
            args: [
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja criar/editar.", type: "STRING", required: true, autocomplete: true },
                { name: "atributo", desc: "Atributo que deseja adicionar/editar na sua ficha", type: "STRING", required: true, autocomplete: true },
                { name: "valor", desc: "Valor que o atributo terá.", type: "STRING", required: true, autocomplete: false },
            ],
            options: [],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "ficha (f)", desc: `
            Este comando serve para a criação de fichas de múltiplos sistemas de RPG.
        
            _Formato do comando:_
            **${"/"}ficha <nome_da_ficha> <atributo> <valor>**
        
            Ex: **${"/"}ficha RPG_Kami nome Kami**
            
            Para excluir algo da sua ficha:
            **${"/"}ficha <nome_da_ficha> <atributo> excluir**
            
            Para adicionar uma imagem na sua ficha:
            **${"/"}ficha <nome_da_ficha> imagem <url_da_imagem>**
            Ou
            **${"$prefix$"}ficha <nome_da_ficha> imagem (imagem em anexo)**
            
            Caso tenha muitas fichas criadas você pode definir uma ficha padrão:
            **${"/"}config**
        
            Para adicionar vários atributos ao mesmo tempo em uma ficha basta utilizar o atributo **multi**
        
            _Formato do comando:_
            **${"/"}ficha <nome_da_ficha> multi <atributo>: <valor> | <atributo2>: <valor>**
        
            Ex: **${"/"}ficha RPG_Kami multi nome: Kami RPG BOT | sanidade: 1**
            `},

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "ficha (s)", desc: `
            This command is used to create sheets of multiple RPG systems.
        
            _Format of the command:_
            **${"/"}ficha <sheet_name> <attribute> <value>**
        
            Ex: **${"/"}ficha RPG_Kami name Kami**
            
            To delete something from your sheet:
            **${"/"}ficha <sheet_name> <attribute> delete**
            
            To add an image to your sheet:
            **${"/"}ficha <sheet_name> image <url_of_image>**
            Or
            **${"$prefix$"}ficha <sheet_name> image (attached image)**
        
            If you have many sheets created you can set a default sheet:
            **${"/"}config**
        
            To add multiple attributes at the same time to a sheet, just use the **multi** attribute
        
            _Format of the command:_
            **${"/"}ficha <sheet_name> multi <attribute>: <value> | <attribute2>: <value>**
        
            Ex: **${"/"}ficha RPG_Kami multi name: Kami RPG BOT | sanity: 1**
            
            `},
            run: this.execute,
            autocomplete: this.autocomplete
        }
    }

    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "ficha")

        int.deferReply({ ephemeral: secret })
            .then(async () => {
                const args = client.utils.args(int)

                const atributosPt = client.resources["pt-"].atributos
                const atributos = client.resources[int.lang].returnAtb()
                const atributosF = client.resources[int.lang].atributosF

                const atbs = new Array()
                const vals = new Array()
                const atbsErr = new Array()

                atributos.push("multi")

                var nomerpg = args.get("nome_da_ficha")
                var atb = args.get("atributo")
                var valor = args.get("valor")

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                if (atb == "imagem" || atb == "image") {
                    const imageType = ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "gif", "gifV"]
                    function validURL(str) {
                        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                        return !!pattern.test(str);
                    }

                    function validImageURL(url) {
                        var validUrlExt = new Map()

                        for (var x in imageType) {
                            var type = url.search(imageType[x])
                            if (type != -1) {
                                var ext = imageType[x]
                                validUrlExt.set("ext", ext)
                                validUrlExt.set("vUrl", true)
                                break
                            }
                            else {
                                validUrlExt.set("vUrl", false)
                                continue
                            }
                        }
                        return validUrlExt
                    }

                    if (valor == "") {
                        return client.commands.get("enviaratributo").run(client, int, "ficha")
                    }
                    else {
                        var validImageUrl = validImageURL(valor)

                        if (!validURL(valor)) { return int.editReply(client.tl({ local: int.lang + "cef-nVUrl", valor: valor })) }
                        if (!validImageUrl.get("vUrl")) { return int.editReply(client.tl({ local: int.lang + "cef-nVExt" })) }
                    }

                }

                if (atb == "multi") {
                    atributos.pop("multi")
                    var atbValor = valor.split("|")

                    valor = new Object()

                    atbValor.forEach(atbVal => {
                        if (atbVal != " " && atbVal != "") {
                            var atb = atbVal.split(":")

                            atb[0] = atb[0].trimStart().trimEnd()
                            atb[1] = atb[1].trimStart().trimEnd()

                            atb[0] = client.utils.matchAtb(atb[0], atributos)

                            if (atb[0].match(/[^0-9a-záéíóúàèìòùâêîôûãõç_()-=+\[\]\{\}\*\|\.\s]+/gi) || atb[0].length > 150) {
                                atbsErr.push(atb[0])
                            }
                            else if (atb[1] == "" || atb[1] == " " || atb[1] == "excluir" || atb[1] == "delete" || atb[1] == "-") {
                                atbsErr.push(atb[0])
                            }
                            else {
                                atbs.push(atb[0])
                                vals.push(atb[1])
                                valor[atb[0]] = atb[1]
                            }
                        }
                    })
                }

                if (!atb) { return client.commands.get("enviar").run(client, int) }
                if (!valor) { return client.commands.get("enviaratributo").run(client, int, "ficha") }

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                client.cache.getFicha(int.user.id, nomerpg)
                    .then(async r => {

                        if (int.lang == "en-" && atb != "multi" && client.utils.isDefaultAtb(atb, atributos)) {
                            atb = atributosPt[atributos.indexOf(atb)]
                        }

                        if (r != undefined) {
                            try { var tryDel = valor.toLowerCase() } catch (err) { }
                            if (tryDel == "excluir" || tryDel == "delete") {
                                const data = new Object()
                                data[`${atb}`] = null

                                client.cache.updateFicha(int.user.id, nomerpg, data, { query: "update" })
                                    .then(r => {
                                        if (client.utils.isDefaultAtb(atb, atributos)) {
                                            atb = atributosF[atributosPt.indexOf(atb)]
                                        }

                                        int.editReply(client.tl({ local: int.lang + "cef-delFicha", nomerpg: nomerpg, atributo: atb }))
                                            .then(async function () {
                                                client.emit("updateFichaBot", int.user.id, nomerpg)
                                                var infoUIRT = await client.cache.getIrt(int.user.id, nomerpg)

                                                if (infoUIRT != "") {
                                                    client.emit("updtFicha", int, { id: int.user.id, nomerpg: nomerpg, irt: infoUIRT })
                                                }
                                            })
                                    })
                                    .catch(err => client.log.error(err, true))
                            }
                            else if (atb == "multi") {
                                client.cache.updateFicha(int.user.id, nomerpg, valor, { query: "update" })
                                    .then(r => {
                                        var msgToSend = String()
                                        if (atbsErr[0]) {
                                            msgToSend = client.tl({ local: int.lang + "cef-updtMultiErr", nomerpg: nomerpg, atributo: atbs, valor: vals, atb: atbsErr })
                                        }
                                        else {
                                            msgToSend = client.tl({ local: int.lang + "cef-updtMulti", nomerpg: nomerpg, atributo: atbs, valor: vals })
                                        }
                                        int.editReply(msgToSend)
                                            .then(async function () {
                                                client.emit("updateFichaBot", int.user.id, nomerpg)
                                                var infoUIRT = await client.cache.getIrt(int.user.id, nomerpg)

                                                if (infoUIRT != "") {
                                                    client.emit("updtFicha", int, { id: int.user.id, nomerpg: nomerpg, irt: infoUIRT })
                                                }
                                            })
                                    })
                                    .catch(err => client.log.error(err, true))
                            }
                            else {
                                const data = new Object()
                                data[`${atb}`] = valor

                                client.cache.updateFicha(int.user.id, nomerpg, data, { query: "update" })
                                    .then(r => {
                                        if (client.utils.isDefaultAtb(atb, atributos)) {
                                            atb = atributosF[atributosPt.indexOf(atb)]
                                        }

                                        int.editReply(client.tl({ local: int.lang + "cef-updtFicha", nomerpg: nomerpg, atributo: atb, valor: valor }))
                                            .then(async function () {
                                                client.emit("updateFichaBot", int.user.id, nomerpg)
                                                var infoUIRT = await client.cache.getIrt(int.user.id, nomerpg)

                                                if (infoUIRT != "") {
                                                    client.emit("updtFicha", int, { id: int.user.id, nomerpg: nomerpg, irt: infoUIRT })
                                                }
                                            })
                                    })
                                    .catch(err => client.log.error(err, true))
                            }
                        }
                        else {
                            if (tryDel == "excluir" || tryDel == "delete") {
                                return int.editReply(client.tl({ local: int.lang + "cef-nFichaEn", nomerpg: nomerpg }))
                            }
                            else {
                                const qFichas = client.cache.getFichasUser(int.user.id)
                                if (qFichas.length >= 10) {
                                    int.editReply({ content: client.tl({ local: int.lang + "cef-lFE" }) })
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


                                int.editReply({ content: client.tl({ local: int.lang + "cef-cCNF", nomerpg: nomerpg }), components: [{ type: 1, components: [bConf, bCanc] }] })
                                    .then(async botmsg => {
                                        if (!int.inGuild()) { botmsg = await client.channels.fetch(int.channelId) }
                                        const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === int.user.id

                                        botmsg.awaitMessageComponent({ filter, time: 30000 })
                                            .then(interaction => {
                                                const choice = interaction.customId.split("|")[0]

                                                if (choice == "conf") {
                                                    if (atb == "multi") {
                                                        client.cache.updateFicha(int.user.id, nomerpg, valor, { query: "insert" })
                                                            .then(r => {
                                                                client.cache.updateFichasUser(int.user.id, nomerpg)
                                                                var msgToSend = String()
                                                                if (atbsErr[0]) {
                                                                    msgToSend = client.tl({ local: int.lang + "cef-updtMultiErr", nomerpg: nomerpg, atributo: atbs, valor: vals, atb: atbsErr })
                                                                }
                                                                else {
                                                                    msgToSend = client.tl({ local: int.lang + "cef-updtMulti", nomerpg: nomerpg, atributo: atbs, valor: vals })
                                                                }
                                                                int.editReply({ content: msgToSend, components: [] })
                                                                    .then(() => {
                                                                        client.emit("createFichaBot", int.user.id, nomerpg)
                                                                    })
                                                            })
                                                            .catch(err => client.log.error(err, true))
                                                    }
                                                    else {
                                                        try { nomerpg = nomerpg.replace(/[ '$%]/g, '') } catch (err) { }
                                                        const senha = client.utils.gerarSenha()

                                                        const data = new Object()
                                                        data[`${atb}`] = valor

                                                        client.cache.updateFicha(int.user.id, nomerpg, data, { query: "insert", resetarSenha: senha })
                                                            .then(r => {
                                                                if (client.utils.isDefaultAtb(atb, atributos)) {
                                                                    atb = atributosF[atributosPt.indexOf(atb)]
                                                                }
                                                                client.cache.updateFichasUser(int.user.id, nomerpg)
                                                                return int.editReply({ content: client.tl({ local: int.lang + "cef-adcFicha", nomerpg: nomerpg, atributo: atb, valor: valor }), components: [] })
                                                                    .then(() => {
                                                                        client.emit("createFichaBot", int.user.id, nomerpg)
                                                                    })
                                                            })
                                                            .catch(err => client.log.error(err, true))
                                                    }
                                                }
                                                else if (choice == "canc") {
                                                    return int.editReply({ content: client.tl({ local: int.lang + "cef-cancelReact" }), components: [] })
                                                }
                                            })
                                            .catch(err => {
                                                if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                                    return int.editReply({ content: client.tl({ local: int.lang + "cef-sConfirm" }), components: [] })
                                                }
                                                else {
                                                    client.log.error(err, true)
                                                }
                                            })
                                    })
                            }
                        }
                    })
                    .catch(err => client.log.error(err, true))
            })
    }

    autocomplete(client, int) {
        const options = int.options._hoistedOptions
        const atributos = client.resources[int.lang].atributos
        const atributosF = client.resources[int.lang].atributosF

        options.forEach(opt => {
            if (opt.name == "atributo" && opt.focused) {
                const find = client.utils.matchAtbAutocomplete(opt.value, atributos)
                const data = new Array()

                find.forEach(f => {
                    let index = client.utils.indexOf(atributos, f)

                    if (index[0] != undefined) {
                        data.push({ name: atributosF[index], value: atributos[index] })
                    }
                })

                if (data.length > 0) {
                    int.respond(data)
                }
            }
            else if (opt.name == "nome_da_ficha" && opt.focused) {
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