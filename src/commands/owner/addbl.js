const toMs = require("milliseconds-parser")()
const time = require("luxon").DateTime

module.exports = class addbl {
    constructor() {
        return {
            ownerOnly: true,
            name: "addbl",
            fName: "addbl",
            desc: 'Altera a blacklist.',
            args: [
                { name: "id", desc: "ID do usuário.", type: "STRING", required: true, autocomplete: false },
                { name: "bans", desc: "Quantidade de bans.", type: "STRING", required: true, autocomplete: true },
                { name: "banatual", desc: "Ban atual.", type: "STRING", required: true, autocomplete: true },
                { name: "duracaoban", desc: "Duração do ban. Ex: '1 semana'", type: "STRING", required: true, autocomplete: true },
            ],
            options: [],
            type: 1,
            run: this.execute,
            autocomplete: this.autocomplete
        }
    }

    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(async () => {
                const args = client.utils.args(int)

                const banid = args.get("id")
                const bans = args.get("bans")
                const banAtual = args.get("banatual")
                const duracaoBan = args.get("duracaoban")

                await client.cache.updateBl(banid, { bans: bans, banAtual: banAtual, duracaoBan: time.now().ts + toMs.parse(duracaoBan) })
                    .then(bl => {
                        return int.editReply(bl)
                    })
            })
    }

    async autocomplete(client, int) {
        const options = int.options._hoistedOptions
        let BlUser = await client.cache.getBl(options[0].value)

        if (!BlUser) {
            BlUser = { id: options[0].value, bans: 0, banAtual: null, duracaoBan: null }
        }


        options.forEach(opt => {
            if (opt.name == "bans" && opt.focused) {
                int.respond([{
                    name: `${Number(BlUser.bans) + 1}`,
                    value: `${Number(BlUser.bans) + 1}`
                }])
            }
            else if (opt.name == "banatual" && opt.focused) {
                if (BlUser.bans <= 3) {
                    int.respond([{ name: "Ban temporário", value: "tempBan", }])
                }
                else {
                    int.respond([{ name: "Ban permanente", value: "permaBan", }])
                }
            }
            else if (opt.name == "duracaoban" && opt.focused) {
                if (BlUser.bans <= 3 && options[2].value == "tempBan") {
                    int.respond([{ name: "1 semana", value: "1 semana", }])
                }
                else {
                    int.respond([{ name: "100 anos", value: "100 anos", }])
                }
            }
        })
    }
}