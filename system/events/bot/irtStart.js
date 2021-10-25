module.exports = {
    name: "irtStart",
    execute: (client, irtU) => {
        client.db.query(`insert into irt (id, nomerpg, msgid, chid) values ('${irtU["id"]}', '${irtU["nomeRpg"]}', '${irtU["msgid"]}', '${irtU["chid"]}')`)

        //client.cache.updateIrt(irtU["id"], irtU["nomeRpg"], irtU["msgid"], irtU["chid"])

        client.log.info("Ficha IRT ativada para ID: " + irtU["id"] + " | Para a ficha: " + irtU["nomeRpg"])
    }
}