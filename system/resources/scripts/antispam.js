const toMs = require("milliseconds-parser")()
const moment = require("moment-timezone")

module.exports.run = function antiSpam(client, msg) {
    var banTime = moment().valueOf()
    userStatus = client.cache.getBl(msg.author.id)

    if (!userStatus) {
        userStatus = {
            bans: 0,
            banAtual: null,
            duracaoBan: null
        }
    }


    userStatus.bans = Number(userStatus.bans)

    if (userStatus.bans >= 3) {
        userStatus.bans = userStatus.bans + 1
        userStatus.banAtual = "permaBan"
        userStatus.duracaoBan = banTime + toMs.parse("100 anos")
    }
    else if (userStatus.bans > 1 && userStatus.bans < 3) {
        userStatus.bans = userStatus.bans + 1
        userStatus.banAtual = "tempBan"
        userStatus.duracaoBan = banTime + toMs.parse("3 horas")
    }
    else if (userStatus.bans >= 0 && userStatus.bans < 2) {
        userStatus.bans = userStatus.bans + 1
        userStatus.banAtual = "tempBan"
        userStatus.duracaoBan = banTime + toMs.parse("1 hora")
    }


    client.cache.updateBl(msg.author.id, userStatus)

    if (msg.lang == "pt-") {
        timeRemain = moment(userStatus.duracaoBan).tz("America/Fortaleza").format("DD/MM/YYYY | HH:mm:ss ") + "(GMT -3)"
    }
    else {
        timeRemain = moment(userStatus.duracaoBan).utc().format("MM/DD/YYYY | HH:mm:ss ") + "(GMT)"
    }

    if (userStatus.banAtual == "tempBan") {
        banEmbed = new client.Discord.MessageEmbed()
            .setColor(client.settings.color)
            .setTitle(`${msg.author.tag} ` + client.tl({ local: msg.lang + "as-timeTiT" }))
            .setDescription(client.tl({ local: msg.lang + "as-timeDescT" }) + "\n")
            .addFields(
                { name: `${client.tl({ local: msg.lang + "as-timeF" })}`, value: `${timeRemain}`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true }
            )
            .setTimestamp(Date.now())
            .setFooter(`${moment().year()} © Kami`, client.user.avatarURL())

        msg.reply({ embeds: [banEmbed] })
        client.log.warn(`Usuário: ${msg.author.tag} banido temporariamente`.red, true)
    }
    else {
        banEmbed = new client.Discord.MessageEmbed()
            .setColor(client.settings.color)
            .setTitle(`${msg.author.tag} ` + client.tl({ local: msg.lang + "as-timeTiP" }))
            .setDescription(client.tl({ local: msg.lang + "as-timeDescP" }))
            .setTimestamp(Date.now())
            .setFooter(`${moment().year()} © Kami`, client.user.avatarURL())

        msg.reply({ embeds: [banEmbed] })
        client.log.warn(`Usuário: ${msg.author.tag} banido permanentemente`.red, true)
    }
}