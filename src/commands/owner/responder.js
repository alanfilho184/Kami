module.exports = class responder {
    constructor() {
        return {
            ownerOnly: true,
            name: 'responder',
            fName: 'Responder',
            desc: 'Envia uma mensagem a um usuário.',
            args: [
                { name: 'id', desc: 'ID do usuário.', type: 'STRING', required: true, autocomplete: false },
                { name: 'mensagem', desc: 'Mensagem para enviar.', type: 'STRING', required: true, autocomplete: false }
            ],
            options: [],
            type: 1,
            run: this.execute
        };
    }

    execute(client, int) {
        int.deferReply({ ephemeral: true }).then(() => {
            const args = client.utils.args(int);

            const respId = args.get('id');
            const respMsg = args.get('mensagem');

            client.shard.broadcastEval(
                (c, ctx) => {
                    const { respId } = JSON.parse(ctx);

                    if (c.users.cache.has(respId)) {
                        return c.shard.ids[0];
                    } else {
                        return false;
                    }
                },
                { context: JSON.stringify({ respId }) }
            )
            .then(res => {
                const shard = res.find(r => r !== false);

                if (shard === undefined) {
                    return int.editReply({ content: 'Usuário não encontrado.', ephemeral: true });
                }

                client.shard.broadcastEval(
                    (c, ctx) => {
                        const { respId, respMsg } = JSON.parse(ctx);

                        const user = c.users.cache.get(respId);
                        user.send(respMsg);
                    },
                    { context: JSON.stringify({ respId, respMsg }), shard: shard }
                )
                .then(() => {
                    int.editReply({ content: 'Mensagem enviada com sucesso.', ephemeral: true });
                })
                .catch(err => {
                    client.log.error(err, true);
                    int.editReply({ content: 'Erro ao enviar a mensagem.', ephemeral: true });
                });
            })

        });
    }
};
