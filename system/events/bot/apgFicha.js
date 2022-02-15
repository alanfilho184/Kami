module.exports = {
    name: "apgFicha",
    type: "bot",
    execute: (client, irtU, msgid) => {
        if (msgid) {
            client.db.query(`delete from irt where id = '${irtU.id}' and nomerpg = '${irtU.nomerpg}' and msgid = '${msgid}'`)
            client.cache.deleteIrt(irtU.id, irtU.nomerpg, msgid)
        }
        else {
            client.db.query(`delete from irt where id = '${irtU.id}' and nomerpg = '${irtU.nomerpg}'`)
            client.cache.deleteIrt(irtU.id, irtU.nomerpg)
        }

        client.log.info("Ficha IRT desativada para ID: " + irtU.id + " | Para a ficha: " + irtU.nomerpg)
    }
}