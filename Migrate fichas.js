const fichas = await client.db.query("select * from fichas");

const fichasJson = new Array()

fichas[0].forEach(f => {
    if (f.id != "undefined         ") {
        if (f.nomerpg != null) {
            const ficha = {
                id: f.id,
                nomerpg: f.nomerpg,
                senha: f.senha
            }

            const atributos = new Object()
            const entries = Object.entries(f)
            entries.forEach(e => {
                if (e[0] != "id" && e[0] != "nomerpg" && e[0] != "senha") {
                    if (e[1] != null) {
                        atributos[e[0]] = e[1].replaceAll(`'`, `"`)
                    }
                }
            })

            ficha.atributos = atributos
            fichasJson.push(ficha)
        }
    }
});

var queryString = `insert into fichasjson (id, nomerpg, senha, lastuse, atributos) values `
var atributosString = ""

const timeNow = time.now().setZone('America/Sao_Paulo').toSQL({ includeZone: true });

var x = 0
fichasJson.forEach(f => {
    atributosString += `('${f.id}', '${f.nomerpg}', '${f.senha}', '${timeNow}', '${JSON.stringify(f.atributos)}')`
    if (x < fichasJson.length - 1) {
        atributosString += ","
    }
    x++
})

const fs = require('fs');
fs.writeFileSync('./fichas.txt', queryString + atributosString)

client.db.query(queryString + atributosString)