const toMs = require("milliseconds-parser")()

module.exports = class addbl {
    constructor() {
        return {
            ownerOnly: true,
            name: "addbl",
            fName: "addbl",
            desc: 'Altera a blacklist.',
            args: [
                { name: "id", desc: "ID do usuário.", type: "STRING", required: true },
                { name: "bans", desc: "Quantidade de bans.", type: "STRING", required: true },
                { name: "banatual", desc: "Ban atual.", type: "STRING", required: true },
                { name: "duracaoban", desc: "Duração do ban. Ex: '1 semana'", type: "STRING", required: true },
            ],
            options: [],
            type: 1,
            run: this.execute
        }
    }

    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(() => {
                const args = client.utils.args(int)

                const banid = args.get("id")
                const bans = args.get("bans")
                const banAtual = args.get("banAtual")
                const duracaoBan = args.get("duracaoBan")

                client.cache.updateBl(banid, { bans: bans, banAtual: banAtual, duracaoBan: toMs.parse(duracaoBan) })
                    .then(bl => {
                        return int.editReply(bl)
                    })
            })
    }
}