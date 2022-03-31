const pass = new Object()
const fs = require("fs")

module.exports = class apiServices {
    constructor(client) {
        pass.client = client
    }

    log(body) {
        pass.client.channels.fetch(pass.client.settings.log)
            .then(c => {
                fs.writeFileSync(`siteLog.txt`, body.log)
                c.send({ content: body.content, files: [`siteLog.txt`] })
            })
    }

    isBeta(body) {
        const beta = pass.client.whitelist.get("beta")
        if (beta.has(body.id)) {
            return { isBeta: true }
        }
        else {
            return { isBeta: false }
        }
    }

    async getUser(id) {
        const fichas = await pass.client.cache.getFichasUser(id)
        return {
            fichas,
        }
    }

    async getFicha(id, nomerpg) {
        const ficha = await pass.client.cache.getFicha(id, nomerpg)

        return ficha
    }

    async getFichaWithPassword(body) {
        const ficha = await pass.client.cache.getFicha(body.id, body.nomerpg)

        if (ficha.senha === body.senha) {
            const user = await pass.client.users.cache.get(body.id)
            ficha.tag = user.tag

            return {
                status: 200,
                data: {
                    ficha: ficha
                }
            }
        }
        else {
            return {
                status: 400,
                title: "Senha incorreta",
                text: "A senha informada é incorreta"
            }
        }
    }

    async updateAtbFicha(body) {
        const atributos = pass.client.resources["pt-"].returnAtb()

        var nomerpg = body.nomerpg
        var atb = body.atb
        var valor = body.valor

        try {
            atb = pass.client.utils.matchAtb(atb, atributos)
        }
        catch (err) { }

        if (atb == "imagem" || atb == "image") {
            const imageType = ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "gif", "gifV"]
            function validURL(str) {
                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                return !!pattern.test(str);
            }

            function validImageURL(url) {
                var validUrlExt = new Map()

                for (var x in imageType) {
                    var type = url.search(imageType[x])
                    if (type != -1) {
                        var ext = imageType[x]
                        validUrlExt.set("ext", ext)
                        validUrlExt.set("vUrl", true)
                        break
                    }
                    else {
                        validUrlExt.set("vUrl", false)
                        continue
                    }
                }
                return validUrlExt
            }

            if (valor != "") {
                var validImageUrl = validImageURL(valor)

                if (!validURL(valor)) {
                    return {
                        status: 400,
                        title: `URL inválida`,
                        text: `A URL que você está tentando adicionar é inválida.`
                    }
                }
                if (!validImageUrl.get("vUrl")) {
                    return {
                        status: 400,
                        title: `Tipo de imagem inválida`,
                        text: `O tipo de imagem que você está tentando adicionar é inválido. as extensões válidas são .jpg, .jpeg, .png, .gif, .gifV`
                    }
                }
            }
        }

        if (false) {
            if (valor.replace(" ", "") == "excluir" || valor.replace(" ", "") == "delete") { }
            else {
                const ficha = await pass.client.cache.getFicha(body.id, nomerpg)
                try { var atbsAtual = ficha["extras"].split("|") }
                catch (err) { atbsAtual = "" }
                var atbsNovos = valor.split("|")

                const atbsA = new Map()
                const atbsN = new Map()

                for (var x in atbsAtual) {
                    var atbE = atbsAtual[x].split(":")[0]
                    var val = atbsAtual[x].split(":")[1]

                    try { atbE = atbE.replace(" ", "") } catch (err) { }
                    try { val = val.replace(/ /, '') } catch (err) { }


                    if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "" && val != undefined) {
                        atbsA.set(atbE, val)
                    }
                }

                for (var x in atbsNovos) {
                    var atbE = atbsNovos[x].split(":")[0]
                    var val = atbsNovos[x].split(":")[1]

                    try { atbE = atbE.replace(" ", "") } catch (err) { }
                    try { val = val.replace(/ /, '') } catch (err) { }


                    if (val != "" && val != undefined) {
                        atbsN.set(atbE, val)
                    }
                }

                atbsN.forEach(function (value, key) {
                    atbsA.set(key, value);
                });

                valor = ""

                var x = 1
                atbsA.forEach(function (value, key) {
                    valor += `${key}: ${value}`

                    if (x != atbsA.size) { valor += `| `; x++ }
                });
            }

        }

        try { nomerpg = nomerpg.replace("'", '') } catch { }

        try {
            await pass.client.cache.updateFicha(body.id, nomerpg, { [atb]: valor }, { query: "update" })

            var infoUIRT = await pass.client.cache.getIrt(body.id, body.nomerpg)

            if (infoUIRT != "") {
                const info = {
                    user: {
                        id: body.id,
                        tag: body.tag
                    },
                    fromSite: true
                }
                pass.client.emit("updtFicha", info, { id: body.id, nomerpg: body.nomerpg, irt: infoUIRT })
            }

            return {
                status: 200,
            }
        }
        catch (err) {
            pass.client.log.error(err, true)
            return {
                status: 500,
                title: "Erro interno",
                text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
            }
        }
    }

    async removeAtbFicha(body) {
        const atributos = pass.client.resources["pt-"].returnAtb()

        var nomerpg = body.nomerpg
        var atb = body.atb
        var valor = body.valor

        try { nomerpg = nomerpg.replace("'", '') } catch { }

        try {
            atb = pass.client.utils.matchAtb(atb, atributos)
        }
        catch (err) { }

        if (false) {
            if (valor.replace(" ", "") == "excluir" || valor.replace(" ", "") == "delete") { }
            else {
                const ficha = await pass.client.cache.getFicha(body.id, nomerpg)
                try { var atbsAtual = ficha["extras"].split("|") }
                catch (err) { atbsAtual = "" }
                var atbsNovos = valor.split("|")

                const atbsA = new Map()
                const atbsN = new Map()

                for (var x in atbsAtual) {
                    var atbE = atbsAtual[x].split(":")[0]
                    var val = atbsAtual[x].split(":")[1]

                    try { atbE = atbE.replace(" ", "") } catch (err) { }
                    try { val = val.replace(/ /, '') } catch (err) { }


                    if (val != "excluir" && val != "delete" && val != "-" && val != "- " && val != "" && val != undefined) {
                        atbsA.set(atbE, val)
                    }
                }

                for (var x in atbsNovos) {
                    var atbE = atbsNovos[x].split(":")[0]
                    var val = atbsNovos[x].split(":")[1]

                    try { atbE = atbE.replace(" ", "") } catch (err) { }
                    try { val = val.replace(/ /, '') } catch (err) { }


                    if (val != "" && val != undefined) {
                        atbsN.set(atbE, val)
                    }
                }

                atbsN.forEach(function (value, key) {
                    atbsA.set(key, value);
                });

                valor = ""

                var x = 1
                atbsA.forEach(function (value, key) {
                    valor += `${key}: ${value}`

                    if (x != atbsA.size) { valor += `| `; x++ }
                });
            }

        }

        try {
            await pass.client.cache.updateFicha(body.id, nomerpg, { [atb]: null }, { query: "update" })

            var infoUIRT = await pass.client.cache.getIrt(body.id, body.nomerpg)

            if (infoUIRT != "") {
                const info = {
                    user: {
                        id: body.id,
                        tag: body.tag
                    },
                    fromSite: true
                }
                pass.client.emit("updtFicha", info, { id: body.id, nomerpg: body.nomerpg, irt: infoUIRT })
            }

            return {
                status: 200,
            }
        }
        catch (err) {
            pass.client.log.error(err, true)
            return {
                status: 500,
                title: "Erro interno",
                text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
            }
        }
    }

    async createFicha(body) {
        const fichasUser = await pass.client.cache.getFichasUser(body.id)

        var nomerpg = body.nomerpg
        try { nomerpg = nomerpg.replace("'", '') } catch { }

        if (fichasUser.includes(nomerpg)) {
            return {
                status: 400,
                title: "Ficha já existe",
                text: "Já existe uma ficha com esse nome, por favor escolha outro nome"
            }
        }
        else if (fichasUser.length >= 10) {
            return {
                status: 400,
                title: "Você atingiu o limite de fichas",
                text: "Você atingiu o limite de fichas por usuário (10 fichas)"
            }
        }
        else if (nomerpg.match(/[ '$%]/g) || nomerpg.length <= 0) {
            return {
                status: 400,
                title: "Nome inválido",
                text: "O nome da ficha não deve conter os caracteres ' $ % ou espaços e deve ter pelo menos 1 caractere"
            }
        }
        else {
            const senha = pass.client.utils.gerarSenha()
            try {
                await pass.client.db.query(`insert into fichas (id, nomerpg, senha) values ('${body.id}', '${nomerpg}', '${senha}')`)
            }
            catch (err) {
                pass.client.log.error(err, true)
                return {
                    status: 500,
                    title: "Erro interno",
                    text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                }
            }

            try { pass.client.cache.updateFichasUser(body.id, nomerpg) } catch (err) { pass.client.log.error(err, true) }

            return {
                status: 200,
            }
        }
    }

    async updateFicha(body) {
        const fichaBot = await pass.client.cache.getFicha(body.id, body.nomerpg)
        var fichaSite = body.ficha
        fichaSite.senha = fichaBot.senha

        const difference = (obj1, obj2) => {
            obj1 = Object.keys(obj1).sort().reduce(function (result, key) {
                result[key] = obj1[key];
                return result;
            }, {});

            obj2 = Object.keys(obj2).sort().reduce(function (result, key) {
                result[key] = obj2[key];
                return result;
            }, {});

            const keys = new Array()
            Object.keys(obj1).forEach(key => {
                if (obj1[key] !== obj2[key]) {
                    keys.push(key)
                }
            });

            return keys;
        };

        const atbsDiff = difference(fichaSite.atributos, fichaBot.atributos)

        if (atbsDiff.length > 0) {
            const data = new Object()
            for (var x of atbsDiff) {
                data[x] = fichaSite.atributos[x]
            }

            try {
                await pass.client.cache.updateFicha(body.id, body.nomerpg, data, { query: "update", oldData: fichaBot })

                var infoUIRT = await pass.client.cache.getIrt(body.id, body.nomerpg)

                if (infoUIRT != "") {
                    const info = {
                        user: {
                            id: body.id,
                            tag: body.tag
                        },
                        fromSite: true
                    }
                    pass.client.emit("updtFicha", info, { id: body.id, nomerpg: body.nomerpg, irt: infoUIRT })
                }

                return {
                    status: 200,
                }
            }
            catch (err) {
                return {
                    status: 500,
                    title: "Erro interno",
                    text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                }
            }
        }
        else {
            return {
                status: 400,
                title: "Nenhuma mudança foi detectada",
                text: "A sua ficha no site e no BOT já são iguais"
            }
        }
    }

    async renameFicha(body) {
        const fichasUser = await pass.client.cache.getFichasUser(body.id)

        var nomerpg = body.novonomerpg
        try { nomerpg = nomerpg.replace("'", '') } catch { }

        if (fichasUser.includes(nomerpg)) {
            return {
                status: 400,
                title: "Ficha já existe",
                text: "Já existe uma ficha com esse nome, por favor escolha outro nome"
            }
        }
        else if (nomerpg.match(/[ '$%]/g) || nomerpg.length <= 0) {
            return {
                status: 400,
                title: "Nome inválido",
                text: "O nome da ficha não deve conter os caracteres ' $ % ou espaços e deve ter pelo menos 1 caractere"
            }
        }
        else if (nomerpg == body.nomerpg) {
            return {
                status: 400,
                title: "Nome não alterado",
                text: "O novo nome da ficha é igual ao antigo"
            }
        }
        else {
            try {
                await pass.client.db.query(`update fichas set nomerpg = '${nomerpg}' where id = '${body.id}' and nomerpg = '${body.nomerpg}'`)
            }
            catch (err) {
                pass.client.log.error(err, true)
                return {
                    status: 500,
                    title: "Erro interno",
                    text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
                }
            }

            try {
                pass.client.cache.deleteFichaUser(body.id, body.nomerpg)
                pass.client.cache.updateFichasUser(body.id, nomerpg)

                var infoUIRT = await pass.client.cache.getIrt(body.id, body.nomerpg)

                if (infoUIRT != "") {
                    pass.client.cache.modifyIrt(nomerpg, infoUIRT)
                        .then((irt) => {
                            const info = {
                                user: {
                                    id: body.id,
                                    tag: body.tag
                                },
                                fromSite: true
                            }

                            pass.client.emit("updtFicha", info, { id: body.id, nomerpg: nomerpg, irt: irt })
                        })
                }

            }
            catch (err) { pass.client.log.error(err, true) }

            return {
                status: 200,
                novonomerpg: nomerpg
            }
        }
    }

    async deleteFicha(body) {
        try {
            await pass.client.db.query(`delete from fichas where id = '${body.id}' and nomerpg = '${body.nomerpg}'`)
        }
        catch (err) {
            pass.client.log.error(err, true)
            return {
                status: 500,
                title: "Erro interno",
                text: "Ocorreu um erro inesperado, um log de erro foi salvo e o problema será corrigido em breve"
            }
        }

        await pass.client.cache.deleteFicha(body.id, body.nomerpg)
        await pass.client.cache.deleteFichaUser(body.id, body.nomerpg)

        const infoUIRT = await pass.client.cache.getIrt(body.id, body.nomerpg)

        if (infoUIRT != "") {
            pass.client.emit("apgFicha", { id: body.id, nomerpg: body.nomerpg })
        }

        return {
            status: 200,
        }
    }
}