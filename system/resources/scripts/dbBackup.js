const fs = require("fs");
const path = require("path")

module.exports = class psql_backup {
    constructor(db) {
        this.db = db
    }

    toJSON(options = { backupPath: path.parse("/"), backupName: "dbBackup", schema: "public" }) {
        var backup = new Object()

        this.db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='${options.schema}' AND table_type='BASE TABLE';`)
            .then(async (tables) => {
                tables.forEach((table) => {
                    this.db.query(`SELECT * FROM ${table}`)
                        .then((res) => {
                            backup[table] = new Array()

                            res[0].forEach(async (item) => {
                                var newItem = new Object()

                                for (var key in item) {
                                    newItem[key] = item[key]
                                }

                                backup[table].push(newItem)
                            })

                            fs.writeFileSync(options.backupPath.toString() + options.backupName, JSON.stringify(backup), { encoding: "utf-8", flag: "w" })
                        })
                })
            })
    }

    toPSQL() {

    }
}
