module.exports = class vote {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "votar",
            cat: "Votar",
            catEn: "Vote",
            desc: 'Envia o link para votar no BOT.',
            descEn: 'Sends the link to vote on the BOT.',
            aliases: ["Vote"],
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

    execute(client, msg) {
        const voteEmbed = new client.Discord.MessageEmbed()
            .setDescription(client.tl({ local: msg.lang + "vote-embedDesc" }))
            .setFooter(client.resources[msg.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
            .setTimestamp()
            .setColor(client.settings.color)

        const bVote = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "vote-embedFT" }))
            .setURL("https://botsparadiscord.com.br/bots/716053210179043409")

        msg.reply({ embeds: [voteEmbed], components: [{ type: 1, components: [bVote] }] })
    }
}
