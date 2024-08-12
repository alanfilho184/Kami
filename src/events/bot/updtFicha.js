function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: 'updtFicha',
    type: 'bot',
    execute: async (client, int, info) => {
        const nomerpg = info.nomerpg;
        const user = int.user.id;

        var irt = info.irt;

        const fichaUser = await client.cache.getFicha(user, nomerpg);

        for (m in irt) {
            try {
                const result = await client.shard.broadcastEval(
                    (c, ctx) => {
                        ctx = JSON.parse(ctx);
                        const ch = c.channels.cache.get(ctx.chid);

                        if (ch) {
                            return [c.shard.ids[0], ch];
                        }
                    },
                    { context: JSON.stringify({ chid: irt[m].chid }) }
                );

                let shard = result.find(e => e != undefined)[0];
                let ch = result.find(e => e != undefined)[1];

                if (isNaN(shard)) {
                    return;
                }

                int.lang = await client.utils.getLang({
                    guildId: ch.guild.id || null,
                    user: {
                        id: int.user.id
                    },
                    inGuild() {
                        ch.type == 'GUILD_TEXT';
                    }
                });

                const reply = client.commands.get('send').create(client, int, fichaUser);

                await client.shard
                    .broadcastEval(
                        async (c, ctx) => {
                            ctx = JSON.parse(ctx);

                            const ch = c.channels.cache.get(ctx.chid);

                            if (ch) {
                                const msg = await ch.messages.fetch(ctx.msgid);

                                msg.edit({embeds: ctx.reply});
                            }
                        },
                        {
                            context: JSON.stringify({ reply: reply, chid: irt[m].chid, msgid: irt[m].msgid }),
                        }
                    )
                    .then(e => {
                        client.log.info(irt[m]);
                    });
            } catch (err) {
                if (err == 'DiscordAPIError: Unknown Channel') {
                    client.db.query(`delete from irt where chid = '${irt[m].chid}'`);
                } else if (err == 'DiscordAPIError: Unknown Message') {
                    client.db.query(
                        `delete from irt where msgid = '${irt[m].msgid}' and id = '${user}' and nomerpg = '${nomerpg}'`
                    );
                    await client.cache.deleteIrt(user, nomerpg, irt[m].msgid);
                } else {
                    client.log.error(err, true);
                    client.log.error(`Info erro IRT:`);
                    client.log.warn(irt);
                    client.log.warn(int);
                }
            }
            await sleep(4000);
        }
        return;
    }
};
