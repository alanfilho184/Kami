const { QueryTypes } = require('sequelize');

module.exports = class ficha {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "ficha",
            cat: "Ficha",
            catEn: "Sheet",
            desc: 'Cria/edita uma ficha.',
            descEn: 'Create/edit a sheet.',
            aliases: ["f", "sheet", "s"],
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "$prefix$" + "ficha (f)", desc: `
            Este comando serve para a criação de fichas de múltiplos sistemas de RPG.
        
            _Formato do comando:_
            **${"$prefix$"}ficha <nome_da_ficha> <atributo> <valor>**
        
            Ex: **${"$prefix$"}ficha RPG_Kami nome Kami**
            
            Para excluir algo da sua ficha:
            **${"$prefix$"}ficha <nome_da_ficha> <atributo> excluir**
            
            <:avisoAjuda:766826097051828235> Você pode ver a lista completa com todos os atributos em:\n**${"$prefix$"}ajuda atributos**
            
            Para adicionar uma imagem na sua ficha:
            **${"$prefix$"}ficha <nome_da_ficha> imagem <url_da_imagem>**
            Ou
            **${"$prefix$"}ficha <nome_da_ficha> imagem (imagem em anexo)**
            
            Caso tenha muitas fichas criadas você pode definir uma ficha padrão:
            **${"$prefix$"}config**
        
            Para adicionar vários atributos ao mesmo tempo em uma ficha basta utilizar o atributo **multi**
        
            _Formato do comando:_
            **${"$prefix$"}ficha <nome_da_ficha> multi <atributo>: <valor> | <atributo2>: <valor>**
        
            Ex: **${"$prefix$"}ficha RPG_Kami multi nome: Kami RPG BOT | sanidade: 1**
            `},

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "$prefix$" + "sheet (s)", desc: `
            This command is used to create sheets of multiple RPG systems.
        
            _Format of the command:_
            **${"$prefix$"}sheet <sheet_name> <attribute> <value>**
        
            Ex: **${"$prefix$"}sheet RPG_Kami name Kami**
            
            To delete something from your sheet:
            **${"$prefix$"}sheet <sheet_name> <attribute> delete**
            
            <:avisoAjuda:766826097051828235> You can see the complete list with all the attributes in:\n**${"$prefix$"}help attributes**
            
            To add an image to your sheet:
            **${"$prefix$"}sheet <sheet_name> image <url_of_image>**
            Or
            **${"$prefix$"}sheet <sheet_name> image (attached image)**
        
            If you have many sheets created you can set a default sheet:
            **${"$prefix$"}config**
        
            To add multiple attributes at the same time to a sheet, just use the **multi** attribute
        
            _Format of the command:_
            **${"$prefix$"}sheet <sheet_name> multi <attribute>: <value> | <attribute2>: <value>**
        
            Ex: **${"$prefix$"}sheet RPG_Kami multi name: Kami RPG BOT | sanity: 1**
            
            `},
            run: this.execute
        }
    }
    async execute(client, msg) {
        var args = client.utils.args(msg)

        const atributosPt = client.resources["pt"].atributos
        const atributos = client.resources[msg.lang.replace("-", "")].returnAtb()
        const atributosF = client.resources[msg.lang.replace("-", "")].atributosF

        atributos.push("multi")

        const beta = client.whitelist.get("beta")
        const premium = client.whitelist.get("premium")

        if (!args[0]) { return msg.reply(client.tl({ local: msg.lang + "cef-nArg" })) }

        var nomeRpg = args[0]
        var atb = args[1]
        var valor = args.slice(2).join(" ")

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }

        try {
            var testAtb = nomeRpg.toLowerCase()
            testAtb = testAtb.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
            const r = await client.cache.getFicha(msg.author.id, nomeRpg)

            if (r[0] == "") { testAtb = client.utils.matchAtb(testAtb, atributos) }

        }
        catch (err) { }

        if (atributos.includes(testAtb)) {
            atb = testAtb
            try { nomeRpg = client.cache.get(msg.author.id).fPadrao } catch (err) { nomeRpg = undefined }
            valor = args.slice(1).join(" ")
        }

        try {
            atb = client.utils.matchAtb(atb, atributos)
            if (!atributos.includes(atb)) { return msg.reply(client.tl({ local: msg.lang + "cef-atbNE", atributo: atb })) }
        }
        catch (err) { }

        if (!nomeRpg) {
            const fichasUser = new Array()
            var result = await client.db.query(`select nomerpg from fichas where id = '${msg.author.id}'`)

            for (x in result[0]) {
                fichasUser.push(result[0][x].nomerpg)
            }

            if (fichasUser.length > 1) { return msg.reply(client.tl({ local: msg.lang + "cef-mFichas1", fichasUser: fichasUser })) }
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

                for (x in imageType) {
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

            if (valor == "" && msg.attachments.size > 0) {
                try {
                    msg.attachments.forEach(a => {
                        const ext = a.contentType.split("/")[1]
                        if (!imageType.includes(ext)) {
                            msg.reply(client.tl({ local: msg.lang + "cef-anIn" }))
                            return false
                        }
                        else {
                            valor = a.url
                            return true
                        }
                    })
                }
                catch (err) {
                    if (err == "TypeError: Cannot read property 'contentType' of undefined") { return msg.reply(client.tl({ local: msg.lang + "cef-inUrl" })) }
                    else { client.log.error(err, true) }
                }
            }
            else if (valor == "" && msg.attachments.size == 0) {
                return client.commands.get("enviaratributo").run(client, msg, "ficha")
            }
            else {
                var validImageUrl = validImageURL(valor)

                if (!validURL(valor)) { return msg.reply(client.tl({ local: msg.lang + "cef-nVUrl", valor: valor })) }
                if (!validImageUrl.get("vUrl")) { return msg.reply(client.tl({ local: msg.lang + "cef-nVExt" })) }
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

            for (x in atbValor) {
                atbs.push(atbValor[x].split(":")[0])
                vals.push(atbValor[x].split(":")[1].replace("'", "ʽ"))
            }

            for (y in atbs + 1) {
                for (x in atbs) {
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
                return msg.reply(client.tl({ local: msg.lang + "cef-allAtbErr" }))
            }

            var colunas = new Array()
            colunas[0] = ""
            colunas[1] = "("
            colunas[2] = "values("

            for (x in atbs) {
                if (msg.lang == "en-") {
                    atbs[x] = atributosPt[atributos.indexOf(atbs[x])]
                }

                colunas[0] += atbs[x] + " = " + `'${vals[x]}'`
                if (x != atbs.length - 1) { colunas[0] += "," }

                colunas[1] += atbs[x]
                if (x != atbs.length - 1) { colunas[1] += "," }

                colunas[2] += `'${vals[x]}'`
                if (x != vals.length - 1) { colunas[2] += "," }
            }

            colunas[1] += `, id, nomerpg)`
            colunas[2] += `,'${msg.author.id}', '${nomeRpg}')`

        }

        if (!atb) { return client.commands.get("enviar").run(client, msg) }
        if (!valor) { return client.commands.get("enviaratributo").run(client, msg, "ficha")}

        if (atb == "extras") {
            if (valor.replace(" ", "") == "excluir" || valor.replace(" ", "") == "delete") {
            }
            else {
                var ficha = await client.cache.getFicha(msg.author.id, nomeRpg)

                try { var atbsAtual = ficha["extras"].split("|") }
                catch (err) { atbsAtual = "" }
                var atbsNovos = valor.split("|")

                const atbsA = new Map()
                const atbsN = new Map()

                for (x in atbsAtual) {
                    var atbE = atbsAtual[x].split(":")[0]
                    var val = atbsAtual[x].split(":")[1]

                    try { atbE = atbE.replace(" ", "") } catch (err) { }
                    try { val = val.replace(/ /, '') } catch (err) { }


                    if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "" && val != undefined) {
                        atbsA.set(atbE, val)
                    }
                }

                for (x in atbsNovos) {
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

        client.cache.getFicha(msg.author.id, nomeRpg)
            .then(async r => {
                if (msg.lang == "en-" && atb != "multi") {
                    atb = atributosPt[atributos.indexOf(atb)]
                }

                if (r != undefined) {
                    try { var tryDel = valor.toLowerCase() } catch (err) { }
                    if (tryDel == "excluir" || tryDel == "delete") {
                        client.cache.updateFicha(msg.author.id, nomeRpg, atb, null)
                            .then(r => {
                                msg.reply(client.tl({ local: msg.lang + "cef-delFicha", nomeRpg: nomeRpg, atributo: atributosF[atributosPt.indexOf(atb)] }))
                                    .then(async function () {
                                        var infoUIRT = await client.cache.getIrt(msg.author.id, nomeRpg)

                                        if (infoUIRT != "") {
                                            client.emit("updtFicha", msg, { id: msg.author.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                        }
                                    })
                            })
                            .catch(err => client.log.error(err, true))
                    }
                    else if (atb == "multi") {
                        const custom_sql = `update fichas set ${colunas[0]} where id = '${msg.author.id}' and nomerpg = '${nomeRpg}'`

                        client.cache.updateFicha(msg.author.id, nomeRpg, atbs, vals, custom_sql)
                            .then(r => {
                                var msgToSend = String()
                                if (atbsErr[0]) {
                                    msgToSend = client.tl({ local: msg.lang + "cef-updtMultiErr", nomeRpg: nomeRpg, atributo: atbs, valor: vals, atb: atbsErr })
                                }
                                else {
                                    msgToSend = client.tl({ local: msg.lang + "cef-updtMulti", nomeRpg: nomeRpg, atributo: atbs, valor: vals })
                                }
                                msg.reply(msgToSend)
                                    .then(async function () {
                                        var infoUIRT = await client.cache.getIrt(msg.author.id, nomeRpg)
                                        if (infoUIRT != "") {
                                            client.emit("updtFicha", msg, { id: msg.author.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                        }
                                    })
                            })
                            .catch(err => client.log.error(err, true))
                    }
                    else {
                        client.cache.updateFicha(msg.author.id, nomeRpg, atb, valor)
                            .then(r => {
                                msg.reply(client.tl({ local: msg.lang + "cef-updtFicha", nomeRpg: nomeRpg, atributo: atributosF[atributosPt.indexOf(atb)], valor: valor }))
                                    .then(async function () {
                                        var infoUIRT = await client.cache.getIrt(msg.author.id, nomeRpg)

                                        if (infoUIRT != "") {
                                            client.emit("updtFicha", msg, { id: msg.author.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                        }
                                    })
                            })
                            .catch(err => client.log.error(err, true))
                    }
                }
                else {
                    if (tryDel == "excluir" || tryDel == "delete") {
                        return msg.reply(client.tl({ local: msg.lang + "cef-nFichaEn", nomeRpg: nomeRpg }))
                    }
                    else {

                        const qFichas = await client.commands.get("listar").api(client, msg.author.id)
                        if (qFichas.length >= 25) {
                            msg.reply({ content: client.tl({ local: msg.lang + "cef-lFE" }) })
                            return
                        }

                        const uniqueID = `${Date.now()}`
                        const bConf = new client.Discord.MessageButton()
                            .setStyle(3)
                            .setLabel(client.tl({ local: msg.lang + "bt-conf" }))
                            .setCustomId("conf|" + uniqueID)

                        const bCanc = new client.Discord.MessageButton()
                            .setStyle(4)
                            .setLabel(client.tl({ local: msg.lang + "bt-canc" }))
                            .setCustomId("canc|" + uniqueID)


                        msg.reply({ content: client.tl({ local: msg.lang + "cef-cCNF", nomeRpg: nomeRpg }), components: [{ type: 1, components: [bConf, bCanc] }] })
                            .then(botmsg => {
                                const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === msg.author.id

                                botmsg.awaitMessageComponent({ filter, time: 30000 })
                                    .then(interaction => {
                                        const choice = interaction.customId.split("|")[0]

                                        if (choice == "conf") {
                                            if (atb == "multi") {
                                                const custom_sql = `insert into fichas ${colunas[1]} ${colunas[2]}`
                                                client.cache.updateFicha(msg.author.id, nomeRpg, atbs, vals, custom_sql)
                                                    .then(r => {
                                                        var msgToSend = String()
                                                        if (atbsErr[0]) {
                                                            msgToSend = client.tl({ local: msg.lang + "cef-updtMultiErr", nomeRpg: nomeRpg, atributo: atbs, valor: vals, atb: atbsErr })
                                                        }
                                                        else {
                                                            msgToSend = client.tl({ local: msg.lang + "cef-updtMulti", nomeRpg: nomeRpg, atributo: atbs, valor: vals })
                                                        }
                                                        botmsg.edit({ content: msgToSend, components: [] })
                                                            .then(async function () {
                                                                var infoUIRT = await client.cache.getIrt(msg.author.id, nomeRpg)

                                                                if (infoUIRT != "") {
                                                                    client.emit("updtFicha", msg, { id: msg.author.id, nomeRpg: nomeRpg, irt: infoUIRT })
                                                                }
                                                            })
                                                    })
                                                    .catch(err => client.log.error(err, true))
                                            }
                                            else {
                                                nomeRpg = nomeRpg.normalize("NFD").replace(/[^\w\s]/gi, '')
                                                
                                                client.db.query(`insert into fichas (id, nomerpg, ${atb}) values ('${msg.author.id}', '${nomeRpg}', :valor)`, {
                                                    replacements: { valor: valor },
                                                    type: QueryTypes.INSERT
                                                })
                                                    .then(r => {
                                                        return botmsg.edit({ content: client.tl({ local: msg.lang + "cef-adcFicha", nomeRpg: nomeRpg, atributo: atributosF[atributosPt.indexOf(atb)], valor: valor }), components: [] })
                                                    })
                                                    .catch(err => client.log.error(err, true))
                                            }
                                        }
                                        else if (choice == "canc") {
                                            return botmsg.edit({ content: client.tl({ local: msg.lang + "cef-cancelReact" }), components: [] })
                                        }
                                    })
                                    .catch(err => {
                                        if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                            return botmsg.edit({ content: client.tl({ local: msg.lang + "cef-sConfirm" }), components: [] })
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

    }
}