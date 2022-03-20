const fs = require("fs");

module.exports = class psql_backup {
    constructor(db) {
        this.db = db
    }

    async toJSON(options = { backupPath: "/", backupName: "dbBackup", schema: "public" }) {
        var backup = new Object({
            tables: new Object(),
            data: new Object()
        })

        const tables = await this.db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='${options.schema}' AND table_type='BASE TABLE';`)

        await tables.forEach(async (table) => {
            const res = await this.db.query(`SELECT * FROM ${table}`)
            res[1].fields.forEach(field => {
                backup.tables[table] = {
                    ...backup.tables[table],
                    [field.name]: field.format
                }
            })

            backup.data[table] = new Array()

            res[0].forEach((item) => {
                var newItem = new Object()

                for (var key in item) {
                    if (typeof item[key] == "object") {
                        Object.entries(item[key]).forEach(([key, value]) => {
                            item[key] = value.charAt(0) == " " ? item[key].substring(1) : item[key]
                        })
                    }
                    else {
                        newItem[key] = item[key].charAt(0) == " " ? item[key].substring(1) : item[key]
                    }
                }

                backup.data[table].push(newItem)
            })

            fs.writeFileSync("dbBackup.json", JSON.stringify(backup), { encoding: "utf-8", flag: "w" })
        })
    }

    toPSQLScript() {
        var sqlScript = ""

        let backup = fs.readFileSync("dbBackup.json", { encoding: "utf-8" })
        backup = JSON.parse(backup)

        for (var table in backup.tables) {
            sqlScript += `DROP TABLE ${table} IF EXISTS;\n`
            sqlScript += `CREATE TABLE ${table} (\n`

            for (var field in backup.tables[table]) {
                sqlScript += `\t${field} ${backup.tables[table][field]},\n`
            }

            sqlScript = sqlScript.substring(0, sqlScript.length - 2) + "\n);\n\n"
        }

        for (var table in backup.data) {
            backup.data[table].forEach(item => {
                sqlScript += `INSERT INTO ${table} (\n`

                for (var field in item) {
                    sqlScript += `\t${field},\n`
                }

                sqlScript = sqlScript.substring(0, sqlScript.length - 2) + "\n)\nVALUES (\n"

                for (var field in item) {
                    if (typeof item[field] == "object") {
                        sqlScript += `\t'${JSON.stringify(item[field])}',\n`
                    }
                    else {
                        sqlScript += `\t'${item[field]}',\n`
                    }
                }

                sqlScript = sqlScript.substring(0, sqlScript.length - 2) + ");\n\n"
            })
        }

        console.log(sqlScript)
    }
}
