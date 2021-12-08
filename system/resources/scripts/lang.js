module.exports = {
    setLang(client, int, toDo, Lang) {
        switch (toDo) {
            case "server":
                if (!Lang) {
                    Lang = "pt-"
                }
                client.cache.update(int.guildId, Lang, "lang", true)
                return Lang

            case "user":
                if (!Lang) {
                    client.commands.get("linguagem").run(client, int)
                    return
                }
                client.cache.update(int.user.id, Lang, "lang", false)
                return Lang

            default:
                client.log.error("toDo não especificado ou incorreto", true)
                return
        }
    }
}