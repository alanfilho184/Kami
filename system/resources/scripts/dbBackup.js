const fs = require("fs");

module.exports = (client) => {
    var backup = new Object()

    client.db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")
        .then(async (tables) => {
            tables.forEach((table) => {
                client.db.query(`SELECT * FROM ${table}`)
                    .then((res) => {
                        backup[table] = new Array()

                        res[0].forEach(async (item) => {
                            var newItem = new Object()

                            for (var key in item) {
                                newItem[key] = item[key]
                            }

                            backup[table].push(newItem)
                        })

                        fs.writeFileSync(`dbBackup.json`, JSON.stringify(backup), { encoding: "utf-8", flag: "w" })
                    })
            })
        })
}
