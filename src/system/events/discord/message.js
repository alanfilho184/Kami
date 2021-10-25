const log = require("../../resources/scripts/logs").log
const toMs = require("milliseconds-parser")()
const moment = require("moment-timezone")

var firstS = true

const occurencies = new Map()
const cooldown = new Map()
const tempblacklist = new Set()
var blacklist = new Object()

const antiSpam = require("../../resources/scripts/antispam").run

var uPcmd = new Map()

function mentionVrf(client, msg) {
    try {
        if (msg.mentions.users.first().id == client.user.id && msg.content == `<@!${client.user.id}>`) {
            return true
        }
        else {
            return false
        }
    }
    catch (err) {
        return false
    }
}

const cmdConfig = new Object({
    disableCmds: new Array(),
    reason: new Object()
})

module.exports = {
    name: "messageCreate",
    type: "djs",
    execute: async (client, msg) => {
        if (firstS) { client.emit("blacklist"); firstS = false }
        const prefix = client.prefix;

        if (msg.channel.id == "818200287700975616" && msg.author.id == "818200398161641513" && msg.author.bot == true) { return client.utils.verifyVote(msg) }

        var mention = mentionVrf(client, msg)

        if (msg.slash) {
            msg.content = prefix + msg.content
        }

        if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot || msg.content == prefix) {
            if (!mention) {
                if (client.utils.verifyRoll(msg)) {
                    msg.content = "k!roll " + msg.content
                }
                else {
                    return
                }
            }
        }

        if (tempblacklist.has(msg.author.id)) return

        try {
            if (blacklist[msg.author.id].banAtual) {
                if (blacklist[msg.author.id].duracaoBan <= moment().valueOf()) {
                    var banUser = blacklist[interaction.member.user.id]
                    client.cache.updateBl(msg.author.id, { bans: banUser.bans, banAtual: null, duracaoBan: null })
                    tempblacklist.delete(msg.author.id)
                }
                else {
                    return
                }
            }
        }
        catch (err) {
            if (err == "TypeError: Cannot read property 'duracaoBan' of undefined") return
        }

        if (msg.slash == undefined) {
            msg.ping = moment().valueOf() - msg.createdTimestamp
            msg.lang = client.utils.getLang(msg)
            msg.slash = false
        }


        if (!msg.lang && msg.channel.type == "DM") { return }

        const args = msg.content.slice(prefix.length).split(/ +/);
        var userCmd = args.shift().toLowerCase();

        if (msg.channel.type == "GUILD_TEXT") {
            log.info(msg.author.tag + " - " + msg.guild.name + " | " + msg.content)

        }
        else {
            log.info(msg.author.tag + " - DM" + " | " + msg.content)
        }

        cooldownU = cooldown.get(msg.author.id);
        if (cooldownU) {
            remaining = cooldownU - moment().valueOf();
            remaining = client.utils.toRound(remaining / 1000)
            if (remaining == 0) {
                remaining = 1
            }

            occurencies.set(msg.author.id, occurencies.get(msg.author.id) + 1 || 1)

            if (occurencies.get(msg.author.id) == 1) {
                msg.reply(client.tl({ local: msg.lang + "as-cooldown", valor: remaining }))
            }

            setTimeout(function () {
                if (occurencies.get(msg.author.id) > 0) {
                    occurencies.set(msg.author.id, occurencies.get(msg.author.id) - 1)
                }
            }, toMs.parse("3 segundos"))

            if (occurencies.get(msg.author.id) >= 5) {
                antiSpam(client, msg)
                tempblacklist.add(msg.author.id)
                setTimeout(() => { tempblacklist.delete(msg.author.id) }, toMs.parse("2 minutos"))
            }
        }
        else {
            try {
                if (mention) {
                    msg.reply(client.tl({ local: msg.lang + "onMsg-ping", msg: msg }))
                        .then(function () {
                            cooldown.set(msg.author.id, moment().valueOf() + toMs.parse("3 segundos"));
                            setTimeout(() => cooldown.delete(msg.author.id), toMs.parse("3 segundos"));

                            client.emit("cmd", msg, "@Bot")
                        })
                }
            }
            catch (err) { }

            userCmd = client.utils.matchAliase(userCmd)
            client.commands.forEach(cmd => {
                if (userCmd == cmd.name) {
                    if (cmd.perm.owner == true && client.settings.owner != msg.author.id) { return msg.reply(client.tl({ local: msg.lang + "onMsg-cmdBarrado" })) }
                    try {
                        try {
                            if (cmdConfig.disableCmds.includes(cmd.name)) {
                                const disableEmbed = new client.Discord.MessageEmbed()
                                    .setTitle(client.tl({ local: msg.lang + "onMsg-cmdDsbTi" }))
                                    .setColor(client.settings.color)
                                    .setDescription(client.tl({ local: msg.lang + "onMsg-cmdDsbDesc", cmd: cmdConfig.reason[cmd.name][msg.lang] }))
                                    .setFooter(client.resources[msg.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
                                    .setTimestamp()
                                return msg.reply({ embeds: [disableEmbed] })
                            }
                        }
                        catch (err) { }

                        if (!msg.slash && !uPcmd[msg.author.id]) {
                            const btLink = new client.Discord.MessageButton()
                                .setStyle(5)
                                .setLabel(client.tl({ local: msg.lang + "onMsg-btSlash" }))
                                .setURL(`https://discord.com/api/oauth2/authorize?client_id=716053210179043409&permissions=${client.settings.permissions}&scope=bot%20applications.commands`)

                            const btInfo = new client.Discord.MessageButton()
                                .setStyle(5)
                                .setLabel(client.tl({ local: msg.lang + "onMsg-btSlashInfo" }))

                            if (msg.lang == "pt-") {
                                btInfo.setURL(`https://support-dev.discord.com/hc/pt-br/articles/4404772028055`)
                            }
                            else {
                                btInfo.setURL(`https://support-dev.discord.com/hc/en-us/articles/4404772028055`)
                            }

                            const btSup = new client.Discord.MessageButton()
                                .setStyle(5)
                                .setLabel(client.tl({ local: msg.lang + "botI-f2V" }))
                                .setURL("https://discord.com/invite/9rqCkFB")

                            msg.channel.send({ content: `<@!${msg.author.id}>\n`+client.tl({ local: msg.lang + "onMsg-slash" }), components: [{ type: 1, components: [btLink, btSup, btInfo] }] })
                            uPcmd[msg.author.id] = true
                        }

                        cmd.run(client, msg)
                            .then(() => {
                                cooldown.set(msg.author.id, moment().valueOf() + toMs.parse("3 segundos"));
                                setTimeout(() => cooldown.delete(msg.author.id), toMs.parse("3 segundos"));

                                client.emit("cmd", msg, cmd.name)
                            })
                            .catch(err => {
                                if (err != "TypeError: Cannot read property 'then' of undefined") { client.log.error(err, true) }
                                client.emit("cmd", msg, cmd.name)
                            })
                    }
                    catch (err) {
                        if (err != "TypeError: Cannot read property 'then' of undefined") { client.log.error(err, true) }
                        else {
                            cooldown.set(msg.author.id, moment().valueOf() + toMs.parse("3 segundos"));
                            setTimeout(() => cooldown.delete(msg.author.id), toMs.parse("3 segundos"));

                            client.emit("cmd", msg, cmd.name)
                        }
                    }
                    log.info("Comando: " + cmd.name + " executado")
                    return
                }

                if (cmd.aliases.includes(userCmd)) {
                    if (cmd.perm.owner == true && client.settings.owner != msg.author.id) { return msg.reply(client.tl({ local: msg.lang + "onMsg-cmdBarrado" })) }
                    try {
                        try {
                            if (cmdConfig.disableCmds.includes(cmd.name)) {
                                const disableEmbed = new client.Discord.MessageEmbed()
                                    .setTitle(client.tl({ local: msg.lang + "onMsg-cmdDsbTi" }))
                                    .setColor(client.settings.color)
                                    .setDescription(client.tl({ local: msg.lang + "onMsg-cmdDsbDesc", cmd: cmdConfig.reason[cmd.name][msg.lang] }))
                                    .setFooter(client.resources[msg.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
                                    .setTimestamp()
                                return msg.reply({ embeds: [disableEmbed] })
                            }
                        }
                        catch (err) { }

                        if (!msg.slash && !uPcmd[msg.author.id]) {
                            const btLink = new client.Discord.MessageButton()
                                .setStyle(5)
                                .setLabel(client.tl({ local: msg.lang + "onMsg-btSlash" }))
                                .setURL(`https://discord.com/api/oauth2/authorize?client_id=716053210179043409&permissions=${client.settings.permissions}&scope=bot%20applications.commands`)

                            const btInfo = new client.Discord.MessageButton()
                                .setStyle(5)
                                .setLabel(client.tl({ local: msg.lang + "onMsg-btSlashInfo" }))

                            if (msg.lang == "pt-") {
                                btInfo.setURL(`https://support-dev.discord.com/hc/pt-br/articles/4404772028055`)
                            }
                            else {
                                btInfo.setURL(`https://support-dev.discord.com/hc/en-us/articles/4404772028055`)
                            }

                            const btSup = new client.Discord.MessageButton()
                                .setStyle(5)
                                .setLabel(client.tl({ local: msg.lang + "botI-f2V" }))
                                .setURL("https://discord.com/invite/9rqCkFB")

                            msg.channel.send({ content: `<@!${msg.author.id}>\n`+client.tl({ local: msg.lang + "onMsg-slash" }), components: [{ type: 1, components: [btLink, btSup, btInfo] }] })
                            uPcmd[msg.author.id] = true
                        }

                        cmd.run(client, msg)
                            .then(() => {
                                cooldown.set(msg.author.id, moment().valueOf() + toMs.parse("3 segundos"));
                                setTimeout(() => cooldown.delete(msg.author.id), toMs.parse("3 segundos"));

                                client.emit("cmd", msg, cmd.name)
                            })
                            .catch(err => { client.log.error(err, true); client.emit("cmd", msg, cmd.name) })
                    }
                    catch (err) {
                        if (err != "TypeError: Cannot read property 'then' of undefined") { client.log.error(err, true) }
                        else {
                            cooldown.set(msg.author.id, moment().valueOf() + toMs.parse("3 segundos"));
                            setTimeout(() => cooldown.delete(msg.author.id), toMs.parse("3 segundos"));

                            client.emit("cmd", msg, cmd.name)
                        }
                    }
                    log.info("Comando: " + cmd.name + " executado")
                    return
                }

            })

            if (occurencies.get(msg.author.id) == 0) {
                occurencies.delete(msg.author.id)
            }
        }
    },
    blacklist: (client) => {
        blacklist = client.cache.getBl()
        client.log.warn("blacklist atualizada")
        return
    },
    disableCmd: (client, info) => {
        cmdConfig.disableCmds = info.disable.cmds
        cmdConfig.reason = info.disable.reason
    }
}

