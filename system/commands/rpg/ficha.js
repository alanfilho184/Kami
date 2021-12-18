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
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja criar/editar.", type: "STRING", required: true },
                { name: "atributo", desc: "Atributo que deseja adicionar/editar na sua ficha", type: "STRING", required: true },
                { name: "valor", desc: "Valor que o atributo terá.", type: "STRING", required: true },
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
            
            <:avisoAjuda:766826097051828235> Você pode ver a lista completa com todos os atributos em:\n**${"/"}ajuda atributos**
            
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
            
            <:avisoAjuda:766826097051828235> You can see the complete list with all the attributes in:\n**${"/"}ajuda**
            
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
            run: this.execute
        }
    }

    execute(client, int) {
        int.deferReply()
            .then(async () => {

                const args = client.utils.args(int)

                const atributosPt = client.resources["pt-"].atributos
                const atributos = client.resources[int.lang].returnAtb()
                const atributosF = client.resources[int.lang].atributosF

                atributos.push("multi")

                const beta = client.whitelist.get("beta")
                const premium = client.whitelist.get("premium")

                if (args.size == 0) { return int.editReply(client.tl({ local: int.lang + "cef-nArg" })) }

                var nomeRpg = args.get("nome_da_ficha")
                var atb = args.get("atributo")
                var valor = args.get("valor")

                try { nomeRpg = nomeRpg.replace("'", '') } catch { }

                try {
                    atb = client.utils.matchAtb(atb, atributos)
                    if (!atributos.includes(atb)) { return int.editReply(client.tl({ local: int.lang + "cef-atbNE", atributo: atb })) }
                }
                catch (err) { }

                if (!nomeRpg) {
                    const fichasUser = new Array()
                    var result = await client.db.query(`select nomerpg from fichas where id = '${int.user.id}'`)

                    for (var x in result[0]) {
                        fichasUser.push(result[0][x].nomerpg)
                    }

                    if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "cef-mFichas1", fichasUser: fichasUser })) }
                    else if (fichasUser.length == 1) { nomeRpg = fichasUser[0] }
                    else { nomeRpg == "1" }
                }

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

                    var atbs = new Array()
                    var vals = new Array()
                    var atbsErr = new Array()
                    var atbsNW = new Array()
                    var y = 0

                    for (var x in atbValor) {
                        atbs.push(atbValor[x].split(":")[0])
                        vals.push(atbValor[x].split(":")[1].replace("'", "ʽ"))
                    }

                    for (var y in atbs + 1) {
                        for (var x in atbs) {
                            if (vals[x][0] == " ") { vals[x] = vals[x].slice(1, 9999) }
                            if (vals[x][vals[x].length - 1] == " ") { vals[x] = vals[x].slice(0, vals[x].length - 1) }
                            atbs[x] = atbs[x].replace(" ", "")


                            atbs[x] = client.utils.matchAtb(atbs[x], atributos)

                            if (!atributos.includes(atbs[x]) || atbs[x] == "extras") {
                                atbsErr.push(atbs[x])
                                atbs.splice(x, 1)
                                vals.splice(x, 1)
                            }
                        }

                    }

                    if (atbs.length == 0) {
                        return int.editReply(client.tl({ local: int.lang + "cef-allAtbErr" }))
                    }

                    var colunas = new Array()
                    colunas[0] = ""
                    colunas[1] = "("
                    colunas[2] = "values("

                    for (var x in atbs) {
                        if (int.lang == "en-") {
                            atbs[x] = atributosPt[atributos.indexOf(atbs[x])]
                        }

                        colunas[0] += atbs[x] + " = " + `'${vals[x]}'`
                        if (x != atbs.length - 1) { colunas[0] += "," }

                        colunas[1] += atbs[x]
                        if (x != atbs.length - 1) { colunas[1] += "," }

                        colunas[2] += `'${vals[x]}'`
                        if (x != vals.length - 1) { colunas[2] += "," }
                    }

                    try { nomeRpg = nomeRpg.normalize("NFD").replace(/[^\w\s]/gi, '') } catch (err) { }

                    const ficha = await client.cache.getFicha(int.user.id, nomeRpg)
                    if (ficha) {
                        colunas[1] += `, id, nomerpg)`
                        colunas[2] += `,'${int.user.id}', '${nomeRpg}')`
                    }
                    else {
                        const senha = client.utils.gerarSenha()

                        colunas[1] += `, id, nomerpg, senha)`
                        colunas[2] += `,'${int.user.id}', '${nomeRpg}', '${senha}')`
                    }


                }

                if (!atb) { return client.commands.get("enviar").run(client, int) }
                if (!valor) { return client.commands.get("enviaratributo").run(client, int, "ficha") }

                if (atb == "extras") {
                    if (valor.replace(" ", "") == "excluir" || valor.replace(" ", "") == "delete") {
                    }
                    else {
                        var ficha = await client.cache.getFicha(int.user.id, nomeRpg)

                        try { var atbsAtual = ficha["extras"].split("|") }
                        catch (err) { atbsAtual = "" }
                        var atbsNovos = valor.split("|")

                        const atbsA = new Map()
                        const atbsN = new Map()

                        for (var x in atbsAtual) {
                            var atbE = atbsAtual[x].split(":")[0]
                            var val = atbsAtual[x].split(":")[1]

                            try { atbE = atbE.replace(" ", "") } catch (err) { }
                            try { val = val.replace(/ /, '') } catch (err) { }


                            if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "" && val != undefined) {
                                atbsA.set(atbE, val)
                            }
                        }

                        for (var x in atbsNovos) {
                            var atbE = atbsNovos[x].split(":")[0]
                            var val = atbsNovos[x].split(":")[1]

                            try { atbE = atbE.replace(" ", "") } catch (err) { }
                            try { val = val.replace(/ /, '') } catch (err) { }


                            if (val != "" && val != undefined) {
                                atbsN.set(atbE, val)
                            }
                        }

                        atbsN.forEach(function (value, key) {
                            atbsA.set(key, value);
                        });

                        valor = ""

                        var x = 1
                        atbsA.forEach(function (value, key) {
                            valor += `${key}: ${value}`

                            if (x != atbsA.size) { valor += `| `; x++ }
                        });
                    }

                }

                try { nomeRpg = nomeRpg.replace("'", '') } catch { }

                client.cache.getFicha(int.user.id, nomeRpg)
                    .then(async r => {
                        if (int.lang == "en-" && atb != "multi") {
                            atb = atributosPt[atributos.indexOf(atb)]
                        }

                        if (r != undefined) {
                            try { var tryDel = valor.toLowerCase() } catch (err) { }
                            if (tryDel == "excluir" || tryDel == "delete") {
                                client.cache.updateFicha(int.user.id, nomeRpg, atb, null)
                                    .then(r => {
                                        int.editReply(client.tl({ local: int.lang + "cef-delFicha", nomeRpg: nomeRpg, atributo: atributosF[atributosPt.indexOf(atb)] }))
                                            .then(async function () {
                                                var infoUIRT = await client.cache.getIrt(int.user.id, nomeRpg)

                                                if (infoUIRT != "") {
                                                    client.emit("updtFicha", int, { id: int.user.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                                }
                                            })
                                    })
                                    .catch(err => client.log.error(err, true))
                            }
                            else if (atb == "multi") {
                                const custom_sql = `update fichas set ${colunas[0]} where id = '${int.user.id}' and nomerpg = '${nomeRpg}'`

                                client.cache.updateFicha(int.user.id, nomeRpg, atbs, vals, custom_sql)
                                    .then(r => {
                                        var msgToSend = String()
                                        if (atbsErr[0]) {
                                            msgToSend = client.tl({ local: int.lang + "cef-updtMultiErr", nomeRpg: nomeRpg, atributo: atbs, valor: vals, atb: atbsErr })
                                        }
                                        else {
                                            msgToSend = client.tl({ local: int.lang + "cef-updtMulti", nomeRpg: nomeRpg, atributo: atbs, valor: vals })
                                        }
                                        int.editReply(msgToSend)
                                            .then(async function () {
                                                var infoUIRT = await client.cache.getIrt(int.user.id, nomeRpg)
                                                if (infoUIRT != "") {
                                                    client.emit("updtFicha", int, { id: int.user.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                                }
                                            })
                                    })
                                    .catch(err => client.log.error(err, true))
                            }
                            else {
                                client.cache.updateFicha(int.user.id, nomeRpg, atb, valor)
                                    .then(r => {
                                        int.editReply(client.tl({ local: int.lang + "cef-updtFicha", nomeRpg: nomeRpg, atributo: atributosF[atributosPt.indexOf(atb)], valor: valor }))
                                            .then(async function () {
                                                var infoUIRT = await client.cache.getIrt(int.user.id, nomeRpg)

                                                if (infoUIRT != "") {
                                                    client.emit("updtFicha", int, { id: int.user.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                                }
                                            })
                                    })
                                    .catch(err => client.log.error(err, true))
                            }
                        }
                        else {
                            if (tryDel == "excluir" || tryDel == "delete") {
                                return int.editReply(client.tl({ local: int.lang + "cef-nFichaEn", nomeRpg: nomeRpg }))
                            }
                            else {

                                const qFichas = await client.commands.get("listar").api(client, int.user.id)
                                if (qFichas.length >= 25) {
                                    int.editReply({ content: client.tl({ local: int.lang + "cef-lFE" }) })
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


                                int.editReply({ content: client.tl({ local: int.lang + "cef-cCNF", nomeRpg: nomeRpg }), components: [{ type: 1, components: [bConf, bCanc] }] })
                                    .then(async botmsg => {
                                        if (!int.inGuild()) { botmsg = await client.channels.fetch(int.channelId) }
                                        const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === int.user.id

                                        botmsg.awaitMessageComponent({ filter, time: 30000 })
                                            .then(interaction => {
                                                const choice = interaction.customId.split("|")[0]

                                                if (choice == "conf") {
                                                    if (atb == "multi") {
                                                        const custom_sql = `insert into fichas ${colunas[1]} ${colunas[2]}`
                                                        client.cache.updateFicha(int.user.id, nomeRpg, atbs, vals, custom_sql)
                                                            .then(r => {
                                                                var msgToSend = String()
                                                                if (atbsErr[0]) {
                                                                    msgToSend = client.tl({ local: int.lang + "cef-updtMultiErr", nomeRpg: nomeRpg, atributo: atbs, valor: vals, atb: atbsErr })
                                                                }
                                                                else {
                                                                    msgToSend = client.tl({ local: int.lang + "cef-updtMulti", nomeRpg: nomeRpg, atributo: atbs, valor: vals })
                                                                }
                                                                int.editReply({ content: msgToSend, components: [] })
                                                                    .then(async function () {
                                                                        var infoUIRT = await client.cache.getIrt(int.user.id, nomeRpg)

                                                                        if (infoUIRT != "") {
                                                                            client.emit("updtFicha", int, { id: int.user.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                                                        }
                                                                    })
                                                            })
                                                            .catch(err => client.log.error(err, true))
                                                    }
                                                    else {
                                                        try { nomeRpg = nomeRpg.normalize("NFD").replace(/[^\w\s]/gi, '') } catch (err) { }
                                                        const senha = client.utils.gerarSenha()

                                                        client.db.query(`insert into fichas (id, nomerpg, ${atb}, senha) values ('${int.user.id}', '${nomeRpg}', :valor, '${senha}')`, {
                                                            replacements: { valor: valor },
                                                            type: QueryTypes.INSERT
                                                        })
                                                            .then(r => {
                                                                return int.editReply({ content: client.tl({ local: int.lang + "cef-adcFicha", nomeRpg: nomeRpg, atributo: atributosF[atributosPt.indexOf(atb)], valor: valor }), components: [] })
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
}