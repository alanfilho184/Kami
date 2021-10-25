module.exports = class termos {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: false,
            },
            name: "termos",
            cat: "Termos",
            catEn: "Terms",
            desc: 'Envia o link para os termos de uso do BOT.',
            descEn: 'Sends the link to see the BOT\'s Terms Of Use.',
            aliases: ["terms", "tos"],
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "termos", desc: `Esse comando mostra o link para que você possa ver os Termos de Uso do Kami
                
                Ex: **${"$prefix$"}votar**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "$prefix$" + "terms", desc: `This command shows you the link so you can see the Terms of Use of Kami
            
                Ex: **${"$prefix$"}terms**`
            },
            run: this.execute
        }
    }

    execute(client, msg) {
        const termEmbed = new client.Discord.MessageEmbed()
            .setDescription(client.tl({ local: msg.lang + "termos-embedDesc" }))
            .setFooter(client.resources[msg.lang.replace("-", "")].footer(), client.user.displayAvatarURL())
            .setTimestamp()
            .setColor(client.settings.color)

        const bTermos = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: msg.lang + "termos-embedFT" }))
            .setURL(msg.lang == "pt-" ? "https://kamibot.netlify.app/termos" : "https://kamibot.netlify.app/terms")


        msg.reply({ embeds: [termEmbed], components: [{ type: 1, components: [bTermos] }] })
    }
}