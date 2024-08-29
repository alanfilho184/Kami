module.exports = class buttonUpdate {
    constructor() {
        return {
            name: 'btUpdate',
            run: this.execute
        };
    }

    execute(client, comp) {
        comp.deferUpdate().then(() => {
            if (comp.user.id == process.env.OWNER) {
                client.channels.fetch(comp.channelId).then(channel => {
                    channel.messages.fetch('784039521645101066').then(msg => {
                        msg.content = msg.content.split('<@720128587289722902> <@716053210179043409>').join('');
                        msg.content = msg.content.split('```js').join('');
                        msg.content = msg.content.split('```').join('');
                        var msgConfig = JSON.parse(msg.content);
                        client.emit('varUpdate', msgConfig);
                        client.shard.broadcastEval(
                            async (c, ctx) => {
                                c.emit('varUpdate', ctx);
                            },
                            {
                                context: JSON.stringify(msgConfig)
                            }
                        );
                        comp.followUp({ content: 'Atualizado com sucesso', ephemeral: true });
                    });
                });
            } else {
                comp.followUp({ content: 'Somente pessoal autorizado pode utilizar esta função', ephemeral: true });
            }
        });
    }
};
