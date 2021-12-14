const setLang = require("../resources/scripts/lang").setLang
const stringSimilarity = require('string-similarity');
const CryptoJS = require("crypto-js");
var roll = require("roll")
roll = new roll()

module.exports = class Utils {

    constructor(options = {}) {
        this.options = options
        this.client = options.client
    }

    args(int) {
        const args = new Map()
        int.options._hoistedOptions.forEach(arg => {
            args.set(arg.name, arg.value)
        })

        return args
    }

    argsString(int) {
        var args = ""
        for (var x in int.options._hoistedOptions) {
            args += int.options._hoistedOptions[x].name + ": " + int.options._hoistedOptions[x].value
            if(x < int.options._hoistedOptions.length-1) {
                args += " | "
            }
        }

        return args
    }

    getLang(int) {
        if (int.guildId != null) {
            var info = this.client.cache.get(int.guildId)

            try { var Lang = info.lang }
            catch (err) {
                if (err == "TypeError: Cannot read property 'lang' of undefined") {
                    var Lang = undefined
                }
            }

            if (!Lang) {
                var Lang = setLang(this.client, int, "server")
                return Lang
            }
            return Lang
        }
        else {
            var info = this.client.cache.get(int.user.id)

            try { var Lang = info.lang }
            catch (err) {
                if (err == "TypeError: Cannot read property 'lang' of undefined") {
                    var Lang = undefined
                }
            }

            if (!Lang) {
                setLang(this.client, int, "user")
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

    replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }

    indexOf(arr, val) {
        var indexes = [], i;
        for (i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

    gerarSenha() {
        const senha = CryptoJS.AES.encrypt(Date.now().toString(), this.client.settings.fKey)
        return senha.toString().slice(33, 43)
    }

}