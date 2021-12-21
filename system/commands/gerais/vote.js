module.exports = class vote {
    constructor() {
        return {
            ownerOnly: false,
            name: "votar",
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
                const voteEmbed = new client.Discord.MessageEmbed()
                    .setDescription(client.tl({ local: int.lang + "vote-embedDesc" }))
                    .setFooter(client.resources.footer(), client.user.displayAvatarURL())
                    .setTimestamp()
                    .setColor(client.settings.color)

                const bVote = new client.Discord.MessageButton()
                    .setStyle(5)
                    .setLabel(client.tl({ local: int.lang + "vote-embedFT" }))
                    .setURL("https://botsparadiscord.com.br/bots/716053210179043409")

                int.editReply({ embeds: [voteEmbed], components: [{ type: 1, components: [bVote] }] })
            })
    }
}
