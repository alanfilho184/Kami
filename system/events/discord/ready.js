const logs = require("../../resources/scripts/logs.js")

module.exports = {
    name: "ready",
    type: "djs",
    execute: async (client) => {
        await logs.startup(client)
        client.log.start("Logado com o BOT: " + client.user.tag, true)
        client.emit("activity", "start")
        client.channels.cache.get("784035696414425108").messages.fetch("784039521645101066")
            .then((msg) => {
                msg.content = msg.content.split("```js").join("")
                msg.content = msg.content.split("```").join("")
                var msgConfig = JSON.parse(msg.content)
                client.emit("varUpdate", msgConfig)
            })
    }

}