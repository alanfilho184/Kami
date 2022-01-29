const { ToInteger } = require("es-abstract");

module.exports = class roll {
    constructor() {
        return {
            ownerOnly: false,
            name: "roll",
            fName: "Roll",
            fNameEn: "Roll",
            desc: 'Rola um dado ou um atributo.',
            descEn: 'Rolls a dice or an attribute.',
            args: [
                { name: "dado_ou_atributo", desc: "Dado ou atributo que deseja rolar.", type: "STRING", required: true, autocomplete: true },
                { name: "nome_da_ficha", desc: "Nome da ficha onde o atributo está", type: "STRING", required: false, autocomplete: true },
            ],
            options: [],
            type: 1,
            helpPt: {
                title: "<:dadosAjuda:766790214030852137> " + "/" + "roll (r)", desc: `
            Role qualquer dado que quiser
        
            _Formato do comando:_
            **${"/"}roll <quantidade_de_dados>d<tamanho_do_dado>**
        
            Ex: **${"/"}roll 3d10**
            
            Você pode usar bônus nos dados (" + ", " - ", " * ", " / ")
            Ex: **${"/"}roll d20+5**
        
            Você também pode rolar vários dados diferentes ao mesmo tempo
            Ex: **${"/"}roll 3d6+2d4+1d10-3**
            
            Se você tiver uma ficha no bot pode rolar um dado direto da ficha
            Ex: **${"/"}roll destreza RPG_Kami**
            <:avisoAjuda:766826097051828235> _O calculo do resultado é feito baseado nas regras do sistema **Call Of Cthulhu**_
            
            Você pode deixar esse comando secreto, assim, o bot sempre irá enviar o resultado na sua DM
            Ex: **${"/"}config**
            Esse comando irá desativar e ativar os dados secretos`},

            helpEn: {
                title: "<:dadosAjuda:766790214030852137> " + "/" + "roll (r)", desc: `
            Roll any dice you want
        
            _Format of the command:_
            **${"/"}roll <quantity_of_dices>d<size_of_dice>**
            
            Ex: **${"/"}roll 3d10**
            
            You can use a bonus on the dice. (" + ", " - ", " * ", " / ")
            Ex: **${"/"}roll d20+5**
        
            You can also roll several different dices at the same time
            Ex: **${"/"}roll 3d6+2d4+1d10-3**
            
            If you have a sheet in the bot you can roll a dice direct from the sheet
            Ex: **${"/"}roll dexterity RPG_Kami**
            <:avisoAjuda:766826097051828235> _The calculation of the result is made based on the rules of system **Call Of Cthulhu**_
            
            You can make this command secret, so the bot will always send the result in your DM
            Ex: **${"/"}config**
            This command will deactivate and activate the secret dices`},
            run: this.execute,
            rollNumber: this.rollNumber,
            rollAtb: this.rollAtb,
            autocomplete: this.autocomplete

        }
    }
    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "roll")

        int.deferReply({ ephemeral: secret })
            .then(() => {
                const args = client.utils.args(int)

                const atributos = client.resources[int.lang].atributos

                if (atributos.includes(client.utils.matchAtb(args.get("dado_ou_atributo").toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributos))) {
                    return this.rollAtb(client, int)
                }
                else {
                    return this.rollNumber(client, int)
                }
            })
    }
    rollNumber(client, int) {
        var roll = require("roll")
        roll = new roll()
        const args = client.utils.args(int)
        var numberDice = args.get("dado_ou_atributo")

        var segments = args.get("dado_ou_atributo").split(/[\+\-\*\/]/)

        var rolled = ""
        var results = new Array()

        var testSize = segments

        const charCount = new Array()

        var qdados = 1,
            tdados = 1,
            bdados = 0

        for (var x in testSize) {
            if (testSize[x].search("d")) {
                var size = testSize[x].split("d")

                if (size.length > 1) {
                    qdados = size[0]
                    tdados = size[1]
                }
                else {
                    if (testSize.length == 1) {
                        tdados = size[0]
                    }
                    else {
                        bdados = size[0]
                    }
                }

            }

            if (Number(qdados) > 10000 || Number(tdados) > 100000000 || Number(bdados) > 100000000) {
                return int.editReply(client.tl({ local: int.lang + "dados-dadoInv", cmd: numberDice }))
            }

            if (Number(qdados) <= 0 || Number(tdados) <= 0 || Number(bdados) < 0) {
                return int.editReply(client.tl({ local: int.lang + "dados-dadoInv", cmd: numberDice }))
            }

            charCount.push(((Number(qdados) * String(tdados).length) + String(bdados).length) * segments.length)
        }

        var cc = 0
        for (var x in charCount) {
            cc = cc + charCount[x]
        }

        if (cc > 1800) {
            return int.editReply(client.tl({ local: int.lang + "dados-rMA", cmd: numberDice }))
        }

        var title = ""

        try {
            if (segments.length > 1) {
                var pass = false
                for (var x in segments) {
                    if (segments[x].search("d") != -1) {
                        pass = true
                    }
                }

                if (!pass) { return int.editReply(client.tl({ local: int.lang + "dados-nD" })) }

                var ops = numberDice.match(/[+*/-]/g)

                for (var x in segments) {
                    if (Number(segments[x].replace("d", "")) > 100000000) {
                        return int.editReply(client.tl({ local: int.lang + "dados-dadoInv", cmd: numberDice }))
                    }

                    if (segments[x] == '') { continue }

                    if (segments[x].search("d") != -1) {
                        var dice = roll.roll(segments[x])
                        results.push(dice.result)

                        if (x == 0) {
                            rolled += "[ " + dice.rolled + " ] "
                            try { rolled += ops[x] + " " } catch (err) { }
                        }
                        else if (x == segments.length - 1) {
                            rolled += "[ " + dice.rolled + " ]"
                        }
                        else {
                            rolled += "[ " + dice.rolled + " ] " + ops[x] + " "
                        }

                        title = numberDice
                    }
                    else {
                        if (x == 0) {
                            rolled += segments[x] + " "
                            rolled += ops[x]
                        }
                        else if (x == segments.length - 1) {
                            rolled += segments[x]
                        }
                        else {
                            rolled += segments[x] + " " + ops[x] + " "
                        }
                        results.push(segments[x])
                        title = numberDice
                    }
                }

                // if (ops.includes("*") || ops.includes("/")) {
                //     const mIndex = client.utils.indexOf(ops, "*")
                //     const divIndex = client.utils.indexOf(ops, "/")
                //     const pIndex = client.utils.indexOf(ops, "+")
                //     const miIndex = client.utils.indexOf(ops, "-")

                //     const newR = new Array()
                //     const newOPS = new Array()

                //     newR.push(results[0])
                //     for (x of mIndex) {
                //         newR.push(results[x + 1])
                //         newOPS.push(ops[x])
                //     }
                //     for (x of divIndex) {
                //         newR.push(results[x + 1])
                //         newOPS.push(ops[x])
                //     }
                //     for (x of miIndex) {
                //         newR.push(results[x + 1])
                //         newOPS.push(ops[x])
                //     }
                //     for (x of pIndex) {
                //         newR.push(results[x + 1])
                //         newOPS.push(ops[x])
                //     }

                //     results = newR
                //     ops = newOPS
                // }

                var r = 0
                for (var x in ops) {
                    var n = Number(results[x])

                    if (x == 0) { r = Number(results[0]) }
                    else {
                        if (ops[x - 1] == "+") {
                            r = r + n
                        }
                        else if (ops[x - 1] == "-") {
                            r = r - n
                        }
                        else if (ops[x - 1] == "*") {
                            r = r * n
                        }
                        else if (ops[x - 1] == "/") {
                            r = r / n
                        }
                    }
                }

                if (ops[ops.length - 1] == "+") {
                    r = r + Number(results[ops.length])
                }
                else if (ops[ops.length - 1] == "-") {
                    r = r - Number(results[ops.length])
                }
                else if (ops[ops.length - 1] == "*") {
                    r = r * Number(results[ops.length])
                }
                else if (ops[ops.length - 1] == "/") {
                    r = r / Number(results[ops.length])
                }

                rolled = numberDice + " = " + rolled + " = " + r
            }
            else {
                if (segments[0].search("d") == -1) {
                    if (Number(segments[0]) > 100000000) {
                        return int.editReply(client.tl({ local: int.lang + "dados-dadoInv", cmd: segments[0] }))
                    }
                    segments[0] = "d" + segments[0]
                    var dice = roll.roll(segments[0])

                    rolled += dice.rolled
                    r = dice.result

                    rolled = "d" + numberDice + " = " + r
                    title = "d" + numberDice
                }
                else {
                    if (segments[0].split("d")[0] == "") {
                        if (Number(segments[0].split("d")[1]) > 100000000) {
                            return int.editReply(client.tl({ local: int.lang + "dados-dadoInv", cmd: segments[0] }))
                        }
                        var dice = roll.roll(segments[0])

                        rolled += dice.rolled
                        r = dice.result

                        rolled = numberDice + " = " + r
                    }
                    else {
                        var dice = roll.roll(segments[0])

                        rolled += dice.rolled
                        r = dice.result

                        rolled = numberDice + " = " + "[ " + rolled + " ]" + " = " + r
                    }

                    title = numberDice
                }
            }

            if (`${r}` == "NaN") {
                throw new Error("Type error: Resultado do dado não foi um número")
            }
        }
        catch (err) {
            return int.editReply(client.tl({ local: int.lang + "dados-dadoInv", cmd: numberDice }))
        }

        const rollEmbed = new client.Discord.MessageEmbed()
            .setTitle(int.user.username + " " + client.tl({ local: int.lang + "dados-embedR2" }) + " " + title)
            .setDescription("**" + rolled + "**")
            .setColor(client.settings.color)
            .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
            .setTimestamp(Date.now())
        if (r <= 100) rollEmbed.setThumbnail(client.resources.assets.d1_100[r])

        int.editReply({ embeds: [rollEmbed] })
    }
    async rollAtb(client, int) {
        const args = client.utils.args(int)
        const atributosPt = client.resources["pt-"].atributos
        const atributos = client.resources[int.lang].atributos
        const atributosF = client.resources[int.lang].atributosF
        const atributosS1 = client.resources["pt-"].atributosStatus
        const atributosI1 = client.resources["pt-"].atributosI1
        const atributosI2 = client.resources["pt-"].atributosI2
        const atributosS1F = client.resources[int.lang].atributosStatusF
        const atributosIF1 = client.resources[int.lang].atributosIF1
        const atributosIF2 = client.resources[int.lang].atributosIF2

        var roll = require("roll")
        roll = new roll()

        var atb = args.get("dado_ou_atributo")
        var nomeRpg = args.get("nome_da_ficha")

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }

        atb = client.utils.matchAtb(atb.toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributos)

        if (!nomeRpg) {
            try {
                var fichasUser = client.cache.get(int.user.id).fPadrao
                nomeRpg = fichasUser
            }
            catch (err) { fichasUser = undefined }

            if (!fichasUser) {
                const fichasUser = new Array()
                var result = await client.db.query(`select nomerpg from fichas where id = '${int.user.id}'`)

                for (var x in result[0]) {
                    fichasUser.push(result[0][x].nomerpg)
                }
                if (fichasUser.length > 1) { return int.editReply(client.tl({ local: int.lang + "ddb-mFichas", fichasUser: fichasUser })) }
                else if (fichasUser.length == 1) { nomeRpg = fichasUser[0] }
                else { return int.editReply(client.tl({ local: int.lang + "ddb-uSF" })) }
            }
        }

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }


        client.cache.getFicha(int.user.id, nomeRpg)
            .then(r => {
                if (r != undefined) {

                    if (int.lang == "en-") {
                        atb = atributosPt[atributos.indexOf(atb)]
                    }
                    var valor = r[atb]

                    const embedRoll = new client.Discord.MessageEmbed()
                    var index = atributosI1.indexOf(atb)
                    var index2 = atributosI2.indexOf(atb)
                    var index3 = atributosS1.indexOf(atb)

                    if (index != -1) {
                        atb = atributosIF1[index]
                        var atbL = "I1"
                    }
                    if (index2 != -1) {
                        atb = atributosIF2[index2]
                        var atbL = "I2"
                    }
                    if (index3 != -1) {
                        atb = atributosS1F[index3]
                        var atbL = "S1"
                    }

                    if (atb == "extras" || atb == "descricao") { atbL = "Ext" }

                    var dice = roll.roll("d100")

                    embedRoll.addField("1d100:", `${dice.result}`, true)

                    if (!valor) {
                        embedRoll.addField(`\u200B`, `\u200B`, true)
                        embedRoll.addField(atributosF[atributos.indexOf(atb.toLowerCase())] + ":", client.tl({ local: int.lang + "ddb-atbSV" }), true)
                    }

                    if (atbL == "S1" && valor) {
                        var result = dice.result
                        var valorDiv = valor
                        var extremo = ToInteger(valorDiv * 0.20)
                        var bom = ToInteger(valorDiv * 0.50)
                        var falha = valor

                        if (result > falha && result != 100) {
                            var resultado = client.tl({ local: int.lang + "ddb-rF" })
                        }
                        else if (result <= falha && result > bom) {
                            var resultado = client.tl({ local: int.lang + "ddb-rN" })
                        }
                        else if (result <= bom && result > extremo) {
                            var resultado = client.tl({ local: int.lang + "ddb-rB" })
                        }
                        else if (result <= extremo && result != 1) {
                            var resultado = client.tl({ local: int.lang + "ddb-rE" })
                        }
                        else if (result == 1) {
                            var resultado = client.tl({ local: int.lang + "ddb-rM" })
                        }
                        else if (result == 100) {
                            var resultado = client.tl({ local: int.lang + "ddb-rD" })
                        }

                        embedRoll.addField(atb + ":", valor, true)
                        if (resultado) { embedRoll.addField(client.tl({ local: int.lang + "ddb-Result" }) + ":", resultado, true) }
                        embedRoll.setTitle(int.user.username + " " + client.tl({ local: int.lang + "ddb-embedTi1", atb: atb }))

                    }
                    else if (atbL == "I1" || atbL == "I2" && valor && valor.length <= 160) {
                        if (valor == undefined || valor == null) { }
                        else {
                            embedRoll.addField(`\u200B`, `\u200B`, true)
                            embedRoll.addField(atb + ":", `${valor}`, true)
                            embedRoll.setTitle(int.user.username + " " + client.tl({ local: int.lang + "ddb-embedTi1", atb: atb }))
                        }
                    }

                    embedRoll.setAuthor({ name:  client.tl({ local: int.lang + "ddb-embedA" }) + nomeRpg + `. ${client.tl({ local: int.lang + "created" })}${int.user.tag}` })
                    if (atbL == "Ext" || atbL == "Desc") {
                        embedRoll.setAuthor({ name:  client.tl({ local: int.lang + "ddb-errEx" }) })
                        embedRoll.setTitle(int.user.username + " " + client.tl({ local: int.lang + "ddb-embedTi2" }))
                    }
                    embedRoll.setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                    embedRoll.setTimestamp()
                    embedRoll.setColor(client.settings.color)
                    embedRoll.setThumbnail(client.resources.assets.d1_100[dice.result])

                    int.editReply({ embeds: [embedRoll] })

                }
                else {
                    return int.editReply(client.tl({ local: int.lang + "ddb-nFE", nomeRpg: nomeRpg }))
                }
            })


    }
    autocomplete(client, int) {
        const options = int.options._hoistedOptions
        const atributos = client.resources[int.lang].atributos
        const atributosF = client.resources[int.lang].atributosF

        options.forEach(opt => {
            if (opt.name == "dado_ou_atributo" && opt.focused) {
                const find = client.utils.matchAtbAutocomplete(opt.value, atributos)
                const data = new Array()

                if (find[0] != opt.value) {
                    find.forEach(f => {
                        let index = client.utils.indexOf(atributos, f)
                        data.push({ name: atributosF[index], value: atributos[index] })
                    })

                    int.respond(data)
                }
            }
            else if (opt.name == "nome_da_ficha" && opt.focused) {
                const find = client.utils.matchNomeFicha(opt.value, client.cache.getFichasUser(int.user.id))
                const data = new Array()

                find.forEach(f => {
                    data.push({ name: f, value: f })
                })

                int.respond(data)
            }
        })
    }


}