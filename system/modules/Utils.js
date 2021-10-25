const setLang = require("../resources/scripts/lang").setLang
const stringSimilarity = require('string-similarity');
const { aliases } = require("../resources/texts/pt")
var roll = require("roll")
roll = new roll()

module.exports = class Utils {

    constructor(options = {}) {

        this.options = options
        this.client = options.client

    }

    args(msg) {
        const args = msg.content.slice(this.client.prefix.length).trim().split(/ +/g);
        args.shift();
        return args;
    }

    getLang(msg) {
        if (msg.channel.type == "GUILD_TEXT") {
            var info = this.client.cache.get(msg.guild.id)

            try { var Lang = info.lang }
            catch (err) {
                if (err == "TypeError: Cannot read property 'lang' of undefined") {
                    var Lang = undefined
                }
            }

            if (!Lang) {
                var Lang = setLang(this.client, msg, "server")
                return Lang
            }
            return Lang
        }
        else {
            var info = this.client.cache.get(msg.author.id)

            try { var Lang = info.lang }
            catch (err) {
                if (err == "TypeError: Cannot read property 'lang' of undefined") {
                    var Lang = undefined
                }
            }

            if (!Lang) {
                setLang(this.client, msg, "user")
                return undefined
            }
            return Lang
        }
    }

    toRound(n) {
        var n = n.toString()
        n = n.split(".")
        var nI = n[0]
        var nP = n[1]
        nI = Number.parseInt(nI)
        nP = nP.slice(0, 1)
        nP = Number.parseInt(nP)

        if (nP > 5 || nP == 5) {
            nI = nI + 1
        }
        return nI
    }

    matchAliase(userCmd) {
        var base = 0.2495

        userCmd = userCmd.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')

        const result = stringSimilarity.findBestMatch(userCmd, aliases)
        const target = result.bestMatch.target
        const rating = result.bestMatch.rating

        var x = 0

        while (x < userCmd.length) {
            base += 0.04962
            x++
        }

        if (base > 0.7) {
            base = 0.7
        }

        if (rating >= base) {
            return target
        }
        else {
            return `Nenhuma combinação igual ou acima de ${base} encontrada | ` + target + ": " + rating
        }
    }

    objToMap(obj) {
        const mp = new Map;
        Object.keys(obj).forEach(k => { mp.set(k, obj[k]) });
        return mp;
    }

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    dice(tdados) {
        var number = 1
        var dice = []
        while (number <= tdados) {
            dice.push(number)
            number += 1
        }
        var result = this.randomChoice(dice)
        return result
    }

    matchAtb(atributo, atributos, customBase) {
        var base = 0.295

        if (customBase) { base = customBase }

        const result = stringSimilarity.findBestMatch(atributo.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributos)
        const target = result.bestMatch.target
        const rating = result.bestMatch.rating

        var x = 0

        while (x < atributo.length) {
            base += 0.045
            x++
        }

        if (base > 0.75) {
            base = 0.75
        }

        if (rating >= base) {
            return target
        }
        else {
            return atributo
        }
    }

    verifyVote(msg) {
        var lang = String()

        try {
            lang = this.client.cache.get(msg.embeds[0].footer.text.split(' ')[0]).lang
        }
        catch (err) {
            lang = "pt-"
        }

        if (lang == null) { lang = "pt-" }

        const user = {
            id: msg.embeds[0].footer.text.split(' ')[0],
            lang: lang
        }

        try {
            this.client.users.fetch(user.id).then(u => {
                const voteEmbed = new this.client.Discord.MessageEmbed()
                    .setTitle(this.client.tl({ local: user.lang + "util-voteTi" }))
                    .setDescription(this.client.tl({ local: user.lang + "util-voteDesc", valor: u.username }))
                    .setFooter(this.client.resources[user.lang.replace("-", "")].footer(), this.client.user.displayAvatarURL())
                    .setTimestamp()
                    .setColor(this.client.settings.color)

                this.client.log.info(`${u.tag} - ${u.id} votou no BOT`, true)
                u.send({ embeds: [voteEmbed] })
            })
        }
        catch (err) { }
    }

    verifyRoll(msg) {
        if (msg.author.bot || msg.channel.type != "GUILD_TEXT") { return }
        const guildInfo = this.client.cache.get(msg.guild.id)
        try {
            if (guildInfo.rollChannel == msg.channel.id) {
                if (!msg.content.startsWith(this.client.prefix)) {
                    const args = msg.content.trim().split(/ +/g);
                    const atributosPt = this.client.resources.pt.atributos
                    const atributosEn = this.client.resources.en.atributos
                    if (atributosPt.includes(this.matchAtb(args[0].toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributosPt, 0.356))) {
                        return true
                    }
                    if (atributosEn.includes(this.matchAtb(args[0].toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributosEn, 0.356))) {
                        return true
                    }
                    try {
                        const r = roll.roll(msg.content)
                        if (typeof (r.result) == "number") {
                            return true
                        }
                    }
                    catch (err) {
                        return false
                    }
                }
                else {
                    return false
                }
            }
            else {
                return false
            }
        }
        catch (err) {
            return false
        }
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    indexOf(arr, val) {
        var indexes = [], i;
        for (i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

}