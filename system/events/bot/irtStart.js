module.exports = {
    name: "irtStart",
    type: "bot",
    execute: (client, irtU) => {
        client.db.query(`insert into irt (id, nomerpg, msgid, chid) values (:id, :nomerpg, :msgid, :chid)`, {
            replacements: {
                id: irtU.id,
                nomerpg: irtU.nomerpg,
                msgid: irtU.msgid,
                chid: irtU.chid
            }
        })

        client.log.info("Ficha IRT ativada para ID: " + irtU["id"] + " | Para a ficha: " + irtU["nomerpg"])
    }
}