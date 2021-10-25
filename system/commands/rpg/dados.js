const setAliases = ["config", "configurar"]

const { ToInteger } = require("es-abstract");

function secretTest(client, msg) {
    if (msg.channel.type == "DM") { return false }

    var userConfig = client.cache.get(msg.author.id)

    try {
        if (userConfig.roll == "true") {
            return true
        }
        if (userConfig.roll == "false" || userConfig.roll == null) {
            return false
        }
    }
    catch (err) {
        if (err == "TypeError: Cannot read property 'roll' of undefined") {
            return false
        }
    }
}

module.exports = class roll {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "roll",
            cat: "Roll",
            catEn: "Roll",
            desc: 'Rola um dado ou um atributo.',
            descEn: 'Rolls a dice or an attribute.',
            aliases: ["r", "dado", "dice", "roll_atributo", "roll_config"],
            helpPt: {
                title: "<:dadosAjuda:766790214030852137> " + "$prefix$" + "roll (r)", desc: `
            Role qualquer dado que quiser
        
            _Formato do comando:_
            **${"$prefix$"}roll <quantidade_de_dados>d<tamanho_do_dado>**
        
            Ex: **${"$prefix$"}roll 3d10**
            
            Você pode usar bônus nos dados (" + ", " - ", " * ", " / ")
            Ex: **${"$prefix$"}roll d20+5**
        
            Você também pode rolar vários dados diferentes ao mesmo tempo
            Ex: **${"$prefix$"}roll 3d6+2d4+1d10-3**
            
            Se você tiver uma ficha no bot pode rolar um dado direto da ficha
            Ex: **${"$prefix$"}roll destreza RPG_Kami**
            <:avisoAjuda:766826097051828235> _O calculo do resultado é feito baseado nas regras do sistema **Call Of Cthulhu**_
            
            Você pode deixar esse comando secreto, assim, o bot sempre irá enviar o resultado na sua DM
            Ex: **${"$prefix$"}config**
            Esse comando irá desativar e ativar os dados secretos`},

            helpEn: {
                title: "<:dadosAjuda:766790214030852137> " + "$prefix$" + "roll (r)", desc: `
            Roll any dice you want
        
            _Format of the command:_
            **${"$prefix$"}roll <quantity_of_dices>d<size_of_dice>**
            
            Ex: **${"$prefix$"}roll 3d10**
            
            You can use a bonus on the dice. (" + ", " - ", " * ", " / ")
            Ex: **${"$prefix$"}roll d20+5**
        
            You can also roll several different dices at the same time
            Ex: **${"$prefix$"}roll 3d6+2d4+1d10-3**
            
            If you have a sheet in the bot you can roll a dice direct from the sheet
            Ex: **${"$prefix$"}roll dexterity RPG_Kami**
            <:avisoAjuda:766826097051828235> _The calculation of the result is made based on the rules of system **Call Of Cthulhu**_
            
            You can make this command secret, so the bot will always send the result in your DM
            Ex: **${"$prefix$"}config**
            This command will deactivate and activate the secret dices`},
            run: this.execute,
            rollNumber: this.rollNumber,
            rollAtb: this.rollAtb,
            secretRoll: this.secretRoll,
            setRoll: this.setRoll

        }
    }
    execute(client, msg) {
        var args = client.utils.args(msg)


        if (!args[0]) { return msg.reply(client.tl({ local: msg.lang + "dados-nArgs" })) }

        args[0] = args[0].toLowerCase()

        //Desativado por enquanto até decidir o que fazer com a falta da message intent
        //if (setAliases.includes(client.utils.matchAtb(args[0], setAliases))) { return this.setRoll(client, msg) }

        const atributos = client.resources[msg.lang.replace("-", "")].atributos

        if (atributos.includes(client.utils.matchAtb(args[0].toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributos))) {
            return this.rollAtb(client, msg)
        }
        else {
            return this.rollNumber(client, msg)
        }

    }
    rollNumber(client, msg) {
        var roll = require("roll")
        roll = new roll()
        const args = client.utils.args(msg)
        const footer = client.resources[msg.lang.replace("-", "")].footer

        var segments = args[0].split(/[\+\-\*\/]/)

        var rolled = ""
        var results = new Array()

        var testSize = segments

        const charCount = new Array()

        var qdados = 1,
            tdados = 1,
            bdados = 0

        for (x in testSize) {
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
                return msg.reply(client.tl({ local: msg.lang + "dados-dadoInv", cmd: args[0] }))
            }

            if (Number(qdados) <= 0 || Number(tdados) <= 0 || Number(bdados) < 0) {
                return msg.reply(client.tl({ local: msg.lang + "dados-dadoInv", cmd: args[0] }))
            }

            charCount.push(((Number(qdados) * String(tdados).length) + String(bdados).length) * segments.length)
        }

        var cc = 0
        for (x in charCount) {
            cc = cc + charCount[x]
        }

        if (cc > 1800) {
            return msg.reply(client.tl({ local: msg.lang + "dados-rMA", cmd: args[0] }))
        }

        var title = ""

        try {
            if (segments.length > 1) {
                var pass = false
                for (x in segments) {
                    if (segments[x].search("d") != -1) {
                        pass = true
                    }
                }

                if (!pass) { return msg.reply(client.tl({ local: msg.lang + "dados-nD" })) }

                var ops = args[0].match(/[+*/-]/g)

                for (x in segments) {
                    if (Number(segments[x].replace("d", "")) > 100000000) {
                        return msg.reply(client.tl({ local: msg.lang + "dados-dadoInv", cmd: args[0] }))
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

                        title = args[0]
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
                        title = args[0]
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
                for (x in ops) {
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

                rolled = args[0] + " = " + rolled + " = " + r
            }
            else {
                if (segments[0].search("d") == -1) {
                    if (Number(segments[0]) > 100000000) {
                        return msg.reply(client.tl({ local: msg.lang + "dados-dadoInv", cmd: segments[0] }))
                    }
                    segments[0] = "d" + segments[0]
                    var dice = roll.roll(segments[0])

                    rolled += dice.rolled
                    r = dice.result

                    rolled = "d" + args[0] + " = " + r
                    title = "d" + args[0]
                }
                else {
                    if (segments[0].split("d")[0] == "") {
                        if (Number(segments[0].split("d")[1]) > 100000000) {
                            return msg.reply(client.tl({ local: msg.lang + "dados-dadoInv", cmd: segments[0] }))
                        }
                        var dice = roll.roll(segments[0])

                        rolled += dice.rolled
                        r = dice.result

                        rolled = args[0] + " = " + r
                    }
                    else {
                        var dice = roll.roll(segments[0])

                        rolled += dice.rolled
                        r = dice.result

                        rolled = args[0] + " = " + "[ " + rolled + " ]" + " = " + r
                    }

                    title = args[0]
                }
            }

            if (`${r}` == "NaN") {
                throw new Error("Type error: Resultado do dado não foi um número")
            }
        }
        catch (err) {
            return msg.reply(client.tl({ local: msg.lang + "dados-dadoInv", cmd: args[0] }))
        }

        const rollEmbed = new client.Discord.MessageEmbed()
            .setTitle(msg.author.username + " " + client.tl({ local: msg.lang + "dados-embedR2" }) + " " + title)
            .setDescription("**" + rolled + "**")
            .setColor(client.settings.color)
            .setFooter(footer(), client.user.displayAvatarURL())
            .setTimestamp(Date.now())
        if (r <= 100) rollEmbed.setThumbnail(client.resources.assets.d1_100[r])

        if (secretTest(client, msg)) {

            if (msg.slash) {
                msg.pureReply({ embeds: [rollEmbed], ephemeral: true })
            }
            else {
                msg.delete()
                msg.author.send({ embeds: [rollEmbed] })
            }
        }
        else {
            msg.reply({ embeds: [rollEmbed] })
        }
    }
    async rollAtb(client, msg) {
        const args = client.utils.args(msg)
        const atributosPt = client.resources["pt"].atributos
        const atributos = client.resources[msg.lang.replace("-", "")].atributos
        const atributosF = client.resources[msg.lang.replace("-", "")].atributosF
        const atributosS1 = client.resources["pt"].atributosStatus
        const atributosI1 = client.resources["pt"].atributosI1
        const atributosI2 = client.resources["pt"].atributosI2
        const atributosS1F = client.resources[msg.lang.replace("-", "")].atributosStatusF
        const atributosIF1 = client.resources[msg.lang.replace("-", "")].atributosIF1
        const atributosIF2 = client.resources[msg.lang.replace("-", "")].atributosIF2
        const footer = client.resources[msg.lang.replace("-", "")].footer
        const msgSecret = client.resources[msg.lang.replace("-", "")].secret()

        var roll = require("roll")
        roll = new roll()

        var atb = args[0]
        var nomeRpg = args[1]

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }

        atb = client.utils.matchAtb(atb.toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributos)

        if (!nomeRpg) {
            try {
                var fichasUser = client.cache.get(msg.author.id).fPadrao
                nomeRpg = fichasUser
            }
            catch (err) { fichasUser = undefined }

            if (!fichasUser) {
                const fichasUser = new Array()
                var result = await client.db.query(`select nomerpg from fichas where id = '${msg.author.id}'`)

                for (x in result[0]) {
                    fichasUser.push(result[0][x].nomerpg)
                }
                if (fichasUser.length > 1) { return msg.reply(client.tl({ local: msg.lang + "ddb-mFichas", fichasUser: fichasUser })) }
                else if (fichasUser.length == 1) { nomeRpg = fichasUser[0] }
                else { return msg.reply(client.tl({ local: msg.lang + "ddb-uSF" })) }
            }
        }

        try { nomeRpg = nomeRpg.replace("'", '') } catch { }


        client.cache.getFicha(msg.author.id, nomeRpg)
            .then(r => {
                if (r != undefined) {

                    if (msg.lang == "en-") {
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
                        embedRoll.addField(atributosF[atributos.indexOf(atb.toLowerCase())] + ":", client.tl({ local: msg.lang + "ddb-atbSV" }), true)
                    }

                    if (atbL == "S1" && valor) {
                        var result = dice.result
                        var valorDiv = valor
                        var extremo = ToInteger(valorDiv * 0.20)
                        var bom = ToInteger(valorDiv * 0.50)
                        var falha = valor

                        if (result > falha && result != 100) {
                            var resultado = client.tl({ local: msg.lang + "ddb-rF" })
                        }
                        else if (result <= falha && result > bom) {
                            var resultado = client.tl({ local: msg.lang + "ddb-rN" })
                        }
                        else if (result <= bom && result > extremo) {
                            var resultado = client.tl({ local: msg.lang + "ddb-rB" })
                        }
                        else if (result <= extremo && result != 1) {
                            var resultado = client.tl({ local: msg.lang + "ddb-rE" })
                        }
                        else if (result == 1) {
                            var resultado = client.tl({ local: msg.lang + "ddb-rM" })
                        }
                        else if (result == 100) {
                            var resultado = client.tl({ local: msg.lang + "ddb-rD" })
                        }

                        embedRoll.addField(atb + ":", valor, true)
                        if (resultado) { embedRoll.addField(client.tl({ local: msg.lang + "ddb-Result" }) + ":", resultado, true) }
                        embedRoll.setTitle(msg.author.username + " " + client.tl({ local: msg.lang + "ddb-embedTi1", atb: atb }))

                    }
                    else if (atbL == "I1" || atbL == "I2" && valor && valor.length <= 160) {
                        if (valor == undefined || valor == null) { }
                        else {
                            embedRoll.addField(`\u200B`, `\u200B`, true)
                            embedRoll.addField(atb + ":", `${valor}`, true)
                            embedRoll.setTitle(msg.author.username + " " + client.tl({ local: msg.lang + "ddb-embedTi1", atb: atb }))
                        }
                    }

                    embedRoll.setAuthor(client.tl({ local: msg.lang + "ddb-embedA" }) + nomeRpg + `. ${client.tl({ local: msg.lang + "created" })}${msg.author.tag}`)
                    if (atbL == "Ext" || atbL == "Desc") {
                        embedRoll.setAuthor(client.tl({ local: msg.lang + "ddb-errEx" }))
                        embedRoll.setTitle(msg.author.username + " " + client.tl({ local: msg.lang + "ddb-embedTi2" }))
                    }
                    embedRoll.setFooter(footer(), client.user.displayAvatarURL())
                    embedRoll.setTimestamp()
                    embedRoll.setColor(client.settings.color)
                    embedRoll.setThumbnail(client.resources.assets.d1_100[dice.result])

                    if (secretTest(client, msg)) {

                        if (msg.slash) {
                            msg.pureReply({ embeds: [embedRoll], ephemeral: true })
                        }
                        else {
                            msg.delete()
                            msg.author.send({ embeds: [embedRoll] })
                        }
                    }
                    else {
                        msg.reply({ embeds: [embedRoll] })
                    }

                }
                else {
                    return msg.reply(client.tl({ local: msg.lang + "ddb-nFE", nomeRpg: nomeRpg }))
                }
            })


    }
    setRoll(client, msg) {
        if (msg.channel.type != "GUILD_TEXT") {
            return msg.reply(client.tl({ local: msg.lang + "ddb-rcGO" }))
        }
        if (msg.author.id != client.settings.owner) {
            if (!msg.member.hasPermission("ADMINISTRATOR") || !msg.member.hasPermission("MANAGE_CHANNELS") || !msg.member.hasPermission("MANAGE_GUILD")) {
                return msg.reply(client.tl({ local: msg.lang + "ddb-rcSP" }))
            }
        }
        var serverConfig = client.cache.get(msg.guild.id)

        if (!serverConfig) {
            userConfig = {
                rollChannel: null
            }
        }

        if (serverConfig.rollChannel != null) {
            client.cache.update(msg.guild.id, null, "rollChannel", true)
            msg.reply(client.tl({ local: msg.lang + "ddb-rcUS" }))
        }
        else {
            client.cache.update(msg.guild.id, msg.channel.id, "rollChannel", true)
            msg.reply(client.tl({ local: msg.lang + "ddb-rcS" }))
        }

        return
    }
}