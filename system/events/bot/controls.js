module.exports = {
    name: "controls",
    type: "bot",
    execute: async (client, comp) => {


        return
        if (reaction.message.id == "784039521645101066" && user.id == client.settings.owner) {
            reaction.users.remove(user.id)
            reaction.message.fetch()
                .then((msg) => {
                    msg.content = msg.content.split("<@720128587289722902> <@716053210179043409>").join("")
                    msg.content = msg.content.split("```js").join("")
                    msg.content = msg.content.split("```").join("")
                    var msgConfig = JSON.parse(msg.content)
                    client.emit("varUpdate", msgConfig)
                })
        }
    }
}