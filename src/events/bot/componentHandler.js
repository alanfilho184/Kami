const time = require("luxon").DateTime;

module.exports = {
    name: "componentHandler",
    type: "bot",
    execute: async (client, comp) => {
        const regEx = /(^[a-zA-z]*)/g
        var func = comp.customId.match(regEx)

        comp.ping = time.now().ts - comp.createdTimestamp
        comp.lang = client.utils.getLang(comp)

        if (!comp.lang) { int.lang = "pt-" }

        client.components.forEach(c => {
            if (func[0] == "irt") { func[0] = "buttonIrt" }
            if (c.name === func[0]) {

                c.run(client, comp)
            }
        })
    }
}