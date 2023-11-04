module.exports = class vote {
    constructor() {
        return {
            ownerOnly: false,
            name: "votar",
            nameEn: "vote",
            fName: "Votar",
            fNameEn: "Vote",
            desc: 'Envia o link para votar no BOT.',
            descEn: 'Sends the link to vote on the BOT.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "votar", desc: `Esse comando mostra o link para que você possa votar no BOT no site Bestlist
                
                Ex: **${"/"}votar**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "votar", desc: `This command shows you the link so you can vote for the BOT on the Bestlist website
            
                Ex: **${"/"}votar**`
            },
            run: this.execute
        }
    }

    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "geral")
        int.deferReply({ ephemeral: secret })
            .then(() => {
                const voteEmbed = new client.Discord.EmbedBuilder()
                    .setDescription(client.tl({ local: int.lang + "vote-embedDesc" }))
                    .setFooter({text: client.resources.footer(), iconURL: client.user.displayAvatarURL()})
                    .setTimestamp()
                    .setColor(parseInt(process.env.EMBED_COLOR))

                const bVote = new client.Discord.ButtonBuilder()
                    .setStyle(5)
                    .setLabel(client.tl({ local: int.lang + "vote-embedFT" }))
                    .setURL("https://botsparadiscord.com.br/bots/716053210179043409")

                int.editReply({ embeds: [voteEmbed], components: [{ type: 1, components: [bVote] }] })
            })
    }
}
