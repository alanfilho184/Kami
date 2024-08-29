const { clearInterval } = require("timers");

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

var actsPadrao = ['teste']//["/ajuda", "/help", "kamiapp.com.br"]
var acts = ['teste']//["/ajuda", "/help", "kamiapp.com.br"]
var status = "online"
var typeStatus = "PLAYING"
var timeChange = 30000
var act = ""

module.exports = {
    name: "activity",
    type: "bot",
    execute: (client, toDo) => {
        function run() {
            client.user.setStatus(status)
            if (act != "") { clearInterval(act) }
            var x = 0
            act = setInterval(() => {
                if (x == acts.length) { x = 0 }
                let textStatus = acts[x]
                client.user.setActivity(`${replaceAll(textStatus, "$prefix$", client.prefix)}`, {
                    type: client.Discord.ActivityType[typeStatus],
                })
                x++
            }, timeChange)
        }

        client.on("varUpdate", info => {
            if (typeof info == "string") {
                info = JSON.parse(info)
            }
            
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