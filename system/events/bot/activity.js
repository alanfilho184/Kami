const { clearInterval } = require("timers");

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

var actsPadrao = [`Quer ajuda? ${"$prefix$"}ajuda`, `Need help? ${"$prefix$"}help`, `Bug? ${"$prefix$"}bug`, `Alguma ideia? ${"$prefix$"}sugestão`, `Vote em mim, me ajuda muito ❤️ | ${"$prefix$"}votar`, "Me convide para outro servidor! $prefix$convite"]
var acts = [`Quer ajuda? ${"$prefix$"}ajuda`, `Need help? ${"$prefix$"}help`, `Bug? ${"$prefix$"}bug`, `Alguma ideia? ${"$prefix$"}sugestão`, `Vote em mim, me ajuda muito ❤️ | ${"$prefix$"}votar`]
var status = "online"
var typeStatus = "WATCHING"
var timeChange = 10000
var act = ""

module.exports = {
    name: "activity",
    type: "bot",
    execute: (client, toDo) => {
        function run() {
            if(act != ""){clearInterval(act)}
            var x = 0
            act = setInterval(() => {
                if (x == acts.length){x = 0}
                let textStatus = acts[x]
                client.user.setPresence({
                    status: status,
                    activities: [{
                        name: `${replaceAll(textStatus, "$prefix$", client.prefix)}`,
                        type: typeStatus,
                    }]
                })
                x++
            }, timeChange)
        }

        client.on("varUpdate", info => {
            if (info.presence.statusMsg == "actsPadrao") {
                acts = actsPadrao
            }
            else {
                acts = info.presence.statusMsg;
            }
            status = info.presence.status;
            typeStatus = info.presence.type;
            timeChange = info.presence.timeChange;
            run()
        })

        if (toDo == "start") {
            run()
        }
    }
}