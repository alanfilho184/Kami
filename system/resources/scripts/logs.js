const moment = require("moment-timezone")
const { inspect } = require('util')
var logTxt = `Log - ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")}\n`

const Inf = new Map()

async function startup(client) {
    const ch = await client.channels.fetch(client.settings.log)

    Inf.set("client", client)
    Inf.set("ch", ch)

    return "Iniciado"
}
function info(msg, ds) {
    if (typeof msg === 'string') {
        logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | INFO ] - ${msg}\n`

        console.log(`[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | INFO ] - ${msg}`.green)
    }
    else {
        logTxt += `---------------- [ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | INFO ] ----------------\n`
        logTxt += msg + "\n"
        logTxt += `---------------- [ FIM DA INFO ] ----------------\n`

        console.log(`---------------- [ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | INFO ] ----------------`.green);
        console.log(msg);
        console.log(`---------------- [ FIM DA INFO ] ----------------`.green)
    }


    if (ds === true) {
        msg = typeof msg === 'string' ? msg : inspect(msg, { depth: 99 })
        Inf.get("ch").send({
            embeds: [{
                title: "INFO",
                description: "```js\n" + msg + "```",
                color: Inf.get("client").settings.color,
                footer: {
                    text: `Informação em: ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} (GMT -3)`,
                    icon_url: Inf.get("client").user.displayAvatarURL()
                }
            }]
        })
            .then(msg => {
                logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | EMBED ] - https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}\n`
            })
    }
}
function start(msg, ds) {
    logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | INICIADO ] - ${msg}\n`
    console.log(`[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | INICIADO ] - ${msg}`.cyan)
    if (ds === true) {
        Inf.get("ch").send({
            embeds: [{
                title: "INICIADO",
                description: "```js\n" + msg + "```",
                color: Inf.get("client").settings.color,
                footer: {
                    text: `Iniciado em: ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} (GMT -3)`,
                    icon_url: Inf.get("client").user.displayAvatarURL()
                }
            }]
        })
            .then(msg => {
                logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | EMBED ] - https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}\n`
            })
    }
}
function warn(msg, ds) {
    if (typeof msg === 'string') {
        logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | AVISO ] - ${msg}\n`
        console.log(`[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | AVISO ] - ${msg}`.yellow)
    }
    else {
        logTxt += `---------------- [ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | AVISO ] ----------------\n`
        logTxt += msg + "\n"
        logTxt += `---------------- [ FIM DO AVISO ] ----------------\n`

        console.log(`---------------- [ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | AVISO ] ----------------`.yellow);
        console.log(msg);
        console.log(`---------------- [ FIM DO AVISO ] ----------------`.yellow);
    }

    if (ds === true) {
        msg = typeof msg === 'string' ? msg : inspect(msg, { depth: 99 })
        Inf.get("ch").send({
            content: `<@${Inf.get("client").settings.owner}>`,
            embeds: [{
                title: "AVISO",
                description: "```js\n" + msg + "```",
                color: Inf.get("client").settings.color,
                footer: {
                    text: `Aviso em: ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} (GMT -3)`,
                    icon_url: Inf.get("client").user.displayAvatarURL()
                }
            }]
        })
            .then(msg => {
                logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | EMBED ] - https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}\n`
            })
    }
}
function error(msg, ds) {
    if (typeof msg === 'string') {
        logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | ERRO ] - ${msg}\n`
        console.log(`[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | ERRO ] - ${msg}`.red)
    }
    else {
        logTxt += `---------------- [ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | ERRO ] ----------------\n`
        logTxt += inspect(msg, { depth: 99 }) + "\n"
        logTxt += `---------------- [ FIM DO ERRO ] ----------------\n`

        console.log(`---------------- [ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | ERRO ] ----------------`.red);
        console.log(msg);
        console.log(`---------------- [ FIM DO ERRO ] ----------------`.red)
    }

    if (ds === true) {
        msg = typeof msg === 'string' ? msg : inspect(msg, { depth: 99 })
        msg = `${String(msg).slice(0, 4000) + (msg.length >= 4000 ? '...' : '')}`

        try {
            Inf.get("ch").send({
                content: `<@${Inf.get("client").settings.owner}>`,
                embeds: [{
                    title: "ERRO",
                    description: "```js\n" + msg + "```",
                    color: Inf.get("client").settings.color,
                    footer: {
                        text: `Erro em: ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} (GMT -3)`,
                        icon_url: Inf.get("client").user.displayAvatarURL()
                    }
                }]
            })
                .then(msg => {
                    logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | EMBED ] - https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}\n`
                })
        }
        catch (err) { process.emit("SIGTERM") }

    }
}
function embed(embed, ping, local) {
    if (ping) {
        return Inf.get("ch").send({ content: `<@${Inf.get("client").settings.owner}>`, embeds: [embed] })
            .then(msg => {
                logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | EMBED ] - https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}\n`
                if (local == "sugestao") {
                    return msg
                }
            })
    }
    else {
        return Inf.get("ch").send({ embeds: [embed] })
            .then(msg => {
                logTxt += `[ ${moment().tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss")} | EMBED ] - https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}\n`
                if (local == "sugestao") {
                    return msg
                }
            })
    }
}

module.exports = {
    startup,
    log: { info, start, warn, error, embed },
    logTxt() { return logTxt }
}
