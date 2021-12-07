module.exports = {
    name: "apgFicha",
    execute: (client, irtU, msgid) => {
        if (msgid) {
            client.db.query(`delete from irt where id = '${irtU.id}' and nomerpg = '${irtU.nomeRpg}' and msgid = '${msgid}'`)
            client.cache.deleteIrt(irtU.id, irtU.nomeRpg, msgid)
        }
        else {
            client.db.query(`delete from irt where id = '${irtU.id}' and nomerpg = '${irtU.nomeRpg}'`)
            client.cache.deleteIrt(irtU.id, irtU.nomeRpg)
        }

        client.log.info("Ficha IRT desativada para ID: " + irtU.id + " | Para a ficha: " + irtU.nomeRpg)
    }
}