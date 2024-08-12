module.exports = {
    async setLang(client, int, toDo, Lang) {
        switch (toDo) {
            case "server":
                if (!Lang) {
                    Lang = int.guildLocale == "pt-BR" ? "pt-" : "en-"
                }
                await client.cache.update(int.guildId, Lang, "lang", true)
                return Lang

            case "user":
                if (!Lang) {
                    Lang = int.locale == "pt-BR" ? "pt-" : "en-"
                }
                await client.cache.update(int.user.id, Lang, "lang", false)
                return Lang

            default:
                client.log.error("toDo não especificado ou incorreto", true)
                return
        }
    }
}