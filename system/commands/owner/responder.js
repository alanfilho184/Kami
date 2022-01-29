
module.exports = class responder {
    constructor() {
        return {
            ownerOnly: true,
            name: "responder",
            fName: "Responder",
            desc: 'Envia uma mensagem a um usuário.',
            args: [
                { name: "id", desc: "ID do usuário.", type: "STRING", required: true, autocomplete: false },
                { name: "mensagem", desc: "Mensagem para enviar.", type: "STRING", required: true, autocomplete: false },
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

                const respId = args.get("id")
                const respMsg = args.get("mensagem")

                client.users.fetch(respId).then(user => {
                    user.send(respMsg)
                        .then(() => {
                            int.editReply(`Pronto, mensagem enviada!`)
                        })
                })
            })
    }
}
