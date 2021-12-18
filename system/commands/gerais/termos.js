module.exports = class termos {
    constructor() {
        return {
            ownerOnly: false,
            name: "termos",
            fName: "Termos",
            fNameEn: "Terms",
            desc: 'Envia o link para os termos de uso do BOT.',
            descEn: 'Sends the link to see the BOT\'s Terms Of Use.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "termos", desc: `Esse comando mostra o link para que você possa ver os Termos de Uso do Kami
                
                Ex: **${"/"}termos**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "termos", desc: `This command shows you the link so you can see the Terms of Use of Kami
            
                Ex: **${"/"}termos**`
            },
            run: this.execute
        }
    }

    execute(client, int) {
        int.deferReply()
        const termEmbed = new client.Discord.MessageEmbed()
            .setDescription(client.tl({ local: int.lang + "termos-embedDesc" }))
            .setFooter(client.resources.footer(), client.user.displayAvatarURL())
            .setTimestamp()
            .setColor(client.settings.color)

        const bTermos = new client.Discord.MessageButton()
            .setStyle(5)
            .setLabel(client.tl({ local: int.lang + "termos-embedFT" }))
            .setURL(`https://kamibot.vercel.app/short/termos/${int.lang}`)


        int.editReply({ embeds: [termEmbed], components: [{ type: 1, components: [bTermos] }] })
    }
}