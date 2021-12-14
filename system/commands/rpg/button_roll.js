var roll = require("roll")
roll = new roll()

module.exports = class button_roll {
    constructor() {
        return {
            ownerOnly: false,
            name: "buttonroll",
            fName: "Button Roll",
            fNameEn: "Button Roll",
            desc: 'Cria uma mensagem com botões customizados para rolar dados.',
            descEn: 'Create a message with custom buttons to roll dices.',
            args: [
                { name: "dados", desc: "Dados que devem ser criados botões, no máximo 25, separados por \"|\" e sem espaços", type: "STRING", required: true },
            ],
            options: [],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "Button Roll", desc: ``
            },
            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "Button Roll", desc: ``
            },
            run: this.execute,
            roll: this.roll
        }
    }
    execute(client, int) {
        int.deferReply()
            .then(() => {
                const beta = client.whitelist.get("beta")

                if (!beta.has(int.user.id)) {
                    int.editReply({ content: "Este comando está em beta fechado, em breve será liberado a todos." })
                }

                const args = client.utils.args(int)
                const dados = args.get("dados").split("|")

                if (dados.length > 25) {
                    return int.editReply("O máximo de dados que você pode adiconar é 25.")
                }

                const buttons = new Array()

                dados.forEach(dado => {
                    var numberDice = dado.split(" ").join("");

                    var bDadosSplit = dado.split(/[\+\-\*\/]/)
                    var segments = new Array()

                    bDadosSplit.forEach(segment => segments.push(segment.split(" ").join("")))

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
                            return console.log("[ERROR] Dice size too big")
                        }

                        if (Number(qdados) <= 0 || Number(tdados) <= 0 || Number(bdados) < 0) {
                            return console.log("[ERROR] Dice size too small")
                        }

                        charCount.push(((Number(qdados) * String(tdados).length) + String(bdados).length) * segments.length)
                    }

                    var cc = 0
                    for (var x in charCount) {
                        cc = cc + charCount[x]
                    }

                    if (cc > 1800) {
                        return console.log("[ERROR] Message too long")
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

                            if (!pass) { return console.log("[ERROR] Invalid dice format") }

                            var ops = numberDice.match(/[+*/-]/g)

                            for (var x in segments) {
                                if (Number(segments[x].replace("d", "")) > 100000000) {
                                    return console.log("[ERROR] Dice size too big")
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
                        return console.log(err)
                    }

                    const button = new client.Discord.MessageButton()
                        .setStyle(1)
                        .setLabel(numberDice)
                        .setCustomId(`buttonRoll|${numberDice}`)

                    buttons.push(button)
                })

                const embed = new client.Discord.MessageEmbed()
                    .setColor(client.settings.color)
                    .setTitle("Clique para rolar")
                    .setDescription(`Clique em um dos dados e sua rolagem será enviada neste chat.
            Se a rolagem secreta estivar ativada, somente você poderá visualizar o resultado.
            `)
                    .setFooter(`${client.user.username} ©`, client.user.avatarURL())
                    .setTimestamp()

                const componentsArray = new Array()

                if (buttons.length <= 5) {
                    componentsArray.push({
                        type: 1,
                        components: buttons
                    })
                }
                else {
                    var x = 0
                    var y = 0
                    var components = new Array()

                    while (x < buttons.length) {
                        if (y == 5) {
                            componentsArray.push(
                                {
                                    type: 1,
                                    components: components
                                }
                            )

                            components = new Array()
                            y = 0
                        }

                        components.push(buttons[x])

                        if (x == buttons.length - 1) {
                            componentsArray.push(
                                {
                                    type: 1,
                                    components: components
                                }
                            )
                        }

                        x++
                        y++
                    }
                }

                console.log(componentsArray)
                int.editReply({ embeds: [embed], components: componentsArray })
            })
    }
    roll(client, int, dice) {
        var numberDice = dice
        const footer = client.resources[int.lang.replace("-", "")].footer

        var segments = dice.split(/[\+\-\*\/]/)

        var rolled = ""
        var results = new Array()

        var title = ""

        try {
            if (segments.length > 1) {
                var pass = false
                for (var x in segments) {
                    if (segments[x].search("d") != -1) {
                        pass = true
                    }
                }

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

        }
        catch (err) {
            return int.followUp(client.tl({ local: int.lang + "dados-dadoInv", cmd: numberDice }))
        }

        const rollEmbed = new client.Discord.MessageEmbed()
            .setTitle(int.user.username + " " + client.tl({ local: int.lang + "dados-embedR2" }) + " " + title)
            .setDescription("**" + rolled + "**")
            .setColor(client.settings.color)
            .setFooter(footer(), client.user.displayAvatarURL())
            .setTimestamp(Date.now())
        if (r <= 100) rollEmbed.setThumbnail(client.resources.assets.d1_100[r])

        const backButton = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel("Voltar aos botões")
            .setURL(`https://discord.com/channels/${int.message.guildId}/${int.message.channelId}/${int.message.id}`)

        int.followUp({ embeds: [rollEmbed], components: [{ type: 1, components: [backButton] }] })
    }

}

