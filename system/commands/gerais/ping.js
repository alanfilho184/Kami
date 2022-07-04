const time = require('luxon').DateTime;

module.exports = class ping {
    constructor() {
        return {
            ownerOnly: false,
            name: 'ping',
            fName: 'Ping',
            fNameEn: 'Ping',
            desc: 'Mostra os tempos de resposta do BOT.',
            descEn: 'Shows the BOT\'s response times.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "ping", desc: `Esse comando serve para verificar o tempo de resposta de diversos locais do BOT
                
                Ex: **${"/"}ping**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "ping", desc: `This command is used to check the response time of several locations of the BOT
            
                Ex: **${"/"}ping**`
            },
            run: this.execute
        };
    }

    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "geral")
        int.deferReply({ ephemeral: secret })
            .then(async () => {

                var dbPing = time.now().ts
                await client.db.query("select 1")
                    .then(() => {
                        dbPing = time.now().ts - dbPing
                    })


                const pingEmbed = new client.Discord.EmbedBuilder()
                    .setColor(client.settings.color)
                    .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                    .addFields([
                        { name: "BOT:", value: "`" + Math.round(int.ping) + " ms`", inline: true },
                        { name: "API:", value: "`" + Math.round(client.ws.ping) + " ms`", inline: true },
                        { name: "DB: ", value: "`" + Math.round(dbPing) + " ms`", inline: true }
                    ])
                    .setTitle("Ping:")
                    .setTimestamp()

                int.editReply({ content: null, embeds: [pingEmbed] })
            })
    }
}
