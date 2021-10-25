module.exports = {
    setLang(client, msg, toDo, Lang) {
        switch (toDo) {
            case "server":
                if (!Lang) {
                    Lang = "pt-"
                }
                client.cache.update(msg.guild.id, Lang, "lang", true)
                return Lang

            case "user":
                if (!Lang) {
                    client.commands.get("linguagem").run(client, msg)
                    return
                }
                client.cache.update(msg.author.id, Lang, "lang", false)
                return Lang

            default:
                client.log.error("toDo não especificado ou incorreto", true)
                return
        }
    }
}