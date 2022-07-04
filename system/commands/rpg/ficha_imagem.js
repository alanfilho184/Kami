const imageType = ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "gif", "gifV"]

module.exports = class ficha_imagem {
    constructor() {
        return {
            ownerOnly: false,
            name: "fichaimagem",
            fName: "Ficha imagem",
            fNameEn: "sheetimage",
            desc: 'Adiciona uma imagem a uma ficha já criada.',
            descEn: '',
            args: [
                { name: "nome_da_ficha", desc: "Nome da ficha que deseja criar/editar.", type: "STRING", required: true, autocomplete: true },
                { name: "imagem", desc: "Imagem que deseja adicionar a ficha", type: "ATTACHMENT", required: true, autocomplete: false }
            ],
            options: [],
            type: 1,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "", desc: ``
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "/" + "", desc: ``
            },
            run: this.execute,
            autocomplete: this.autocomplete
        }
    }

    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "ficha")
        
        int.deferReply({ ephemeral: secret })
            .then(async () => {
                const args = client.utils.args(int)

                const beta = client.whitelist.get("beta")

                var nomerpg = args.get("nome_da_ficha")
                var imagem = int.options.get("imagem").attachment

                try { nomerpg = nomerpg.replace("'", '') } catch { }

                if (!imageType.includes(imagem.contentType.split("/")[1])) {
                    return int.editReply({ content: client.tl({ local: int.lang + "fi-fInv" }) })
                }

                client.cache.getFicha(int.user.id, nomerpg)
                    .then(r => {
                        if (r) {
                            client.cache.updateFicha(int.user.id, nomerpg, { imagem: imagem.url }, { query: "update" })
                                .then(async r => {
                                    var infoUIRT = await client.cache.getIrt(int.user.id, nomerpg)

                                    if (infoUIRT != "") {
                                        client.emit("updtFicha", int, { id: int.user.id, nomerpg: nomerpg, irt: infoUIRT })
                                    }

                                    return int.editReply({ content: client.tl({ local: int.lang + "fi-iAdd", imagem: imagem.name, nomerpg: nomerpg }) })
                                })
                        }
                        else {
                            return int.editReply({ content: client.tl({ local: int.lang + "fi-fNE", nomerpg: nomerpg }) })
                        }
                    })
            })
    }
    autocomplete(client, int) {
        const options = int.options._hoistedOptions

        options.forEach(opt => {
            if (opt.name == "nome_da_ficha" && opt.focused) {
                const fichasUser = client.cache.getFichasUser(int.user.id)

                if (fichasUser.length >= 1) {
                    const find = client.utils.matchNomeFicha(opt.value, fichasUser)
                    const data = new Array()

                    find.forEach(f => {
                        data.push({ name: f, value: f })
                    })

                    int.respond(data)
                }
            }
        })
    }
}