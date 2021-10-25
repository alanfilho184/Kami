module.exports = class invite {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "convite",
            cat: "Convite",
            catEn: "Invite",
            desc: 'Envia o link para adicionar o BOT.',
            descEn: 'Sends the link to add the BOT.',
            aliases: ["invite", "link"],
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "convite", desc: `Esse comando mostra o link para que você possa convidar o BOT para outros servidores
                
                Ex: **${"$prefix$"}convite**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "invite", desc: `This command shows you the link so you can invite the BOT to other guilds
            
                Ex: **${"$prefix$"}invite**`
            },
            run: this.execute
        }
    }

    execute(client, msg) {
        const inviteEmbed = new client.Discord.MessageEmbed()
            .setDescription(client.tl({ local: msg.lang + "inv-embedDesc" }))
            .setFooter(client.resources[msg.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
            .setTimestamp()
            .setColor(client.settings.color)

        const bInv = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "inv-embedFT" }))
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=716053210179043409&permissions=${client.settings.permissions}&scope=bot%20applications.commands`)

        msg.reply({ embeds: [inviteEmbed], components: [{type: 1, components: [bInv]}] })
    }
}