const setLang = require("../resources/scripts/lang").setLang
const stringSimilarity = require('string-similarity');
const CryptoJS = require("crypto-js");
const time = require("luxon").DateTime
var roll = require("roll");
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
            if (x < int.options._hoistedOptions.length - 1) {
                args += " | "
            }
        }

        return args
    }

    getLang(int) {
        if (int.inGuild()) {
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
                return setLang(this.client, int, "user")
            }
            return Lang
        }
    }

    userOnBlacklist(id) {
        const info = this.client.cache.getBl(id)
        try {
            if (info.banAtual != null) {
                if (info.duracaoBan <= time.now().ts) {
                    info.banAtual = null
                    info.duracaoBan = null
                    this.client.cache.updateBl(id, { bans: info.bans, banAtual: null, duracaoBan: null })

                    return false
                }
                else {
                    return true
                }
            }
            else {
                return false
            }
        }
        catch (err) {
            if (err == "TypeError: Cannot read properties of undefined (reading 'banAtual')") {
                return false
            }
            else {
                this.client.log.error(err, true)
                return false
            }
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

    matchAtbAutocomplete(atributo, atributos, customBase) {
        var base = 0.155

        var x = 0
        while (x < atributo.length) {
            base += 0.025
            x++
        }

        if (base > 0.7) {
            base = 0.7
        }

        if (customBase) { base = customBase }

        const result = stringSimilarity.findBestMatch(atributo.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), atributos)

        const matchs = new Array()
        result.ratings.forEach(match => {
            if (match.rating >= base) {
                matchs.push(match)
            }
        })

        matchs.sort(function (a, b) {
            return b.rating - a.rating
        })

        var x = 0
        const find = new Array()
        matchs.forEach(match => {
            if (x >= 8) { return }
            find.push(match.target)
            x++
        })

        return find.length == 0 ? new Array(atributo) : find
    }

    matchNomeFicha(typing, fichas) {
        var base = 0.0

        var x = 0

        while (x < typing.length) {
            base += 0.045
            x++
        }

        if (base > 0.75) {
            base = 0.75
        }

        const result = stringSimilarity.findBestMatch(typing, fichas)

        const matchs = new Array()
        result.ratings.forEach(match => {
            if (match.rating >= base) {
                matchs.push(match)
            }
        })

        matchs.sort(function (a, b) {
            return b.rating - a.rating
        })

        const find = new Array()
        matchs.forEach(match => {
            find.push(match.target)
        })

        return find.length == 0 ? fichas.sort() : find
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

    secret(userConfig, local) {
        var secret

        try {
            if (userConfig[local] == "true") {
                secret = true
            }
            if (userConfig[local] == "false" || userConfig[local] == null) {
                secret = false
            }
        }
        catch (err) {
            if (err == `TypeError: Cannot read property '${local}' of undefined`) {
                secret = false
            }
        }

        return secret
    }

    mention(msg) {
        if (msg.mentions.users.size == 1 && msg.mentions.users.first().id == this.client.user.id && msg.content == `<@!${this.client.user.id}>`) {
            return true
        }
        else {
            return false
        }
    }
}