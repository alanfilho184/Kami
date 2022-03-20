const fs = require("fs");
const path = require("path")

module.exports = class psql_backup {
    constructor({ db, options }) {
        this.db = db
        this.options = options
    }

    toJSON(options = { backupPath: path.parse("/"), backupName: "dbBackup", schema: "public" }) {
        var backup = new Object()

        this.db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='${options.schema}' AND table_type='BASE TABLE';`)
            .then(async (tables) => {
                tables.forEach((table) => {
                    this.db.query(`SELECT * FROM ${table}`)
                        .then((res) => {
                            //TODO Salvar tipos e tamanho das colunas
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

    toPSQLScript() {
        var sqlScript = ""

        let backup = fs.readFileSync(this.options.backupPath.toString() + this.options.backupName, { encoding: "utf-8" })
        backup = JSON.parse(backup)

        //TODO loop para criar tabelas

        Object.keys(backup).forEach(table => {
            sqlScript += `INSERT INTO ${TABLE} (`

            Object.keys(backup[table]).forEach(key => {
                sqlScript += `${key},`
            })

            sqlScript.substring(sqlScript.length, sqlScript.length - 1)
            sqlScript += ")\n VALUES ("

            Object.values(backup[table]).forEach(value => {
                sqlScript += `${value},`
            })

            sqlScript.substring(sqlScript.length, sqlScript.length - 1)
            sqlScript += ")"
        })
    }
}
