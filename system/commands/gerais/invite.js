module.exports = class invite {
    constructor() {
        return {
            ownerOnly: false,
            name: "convite",
            fName: "Convite",
            fNameEn: "Invite",
            desc: 'Envia o link para adicionar o BOT.',
            descEn: 'Sends the link to add the BOT.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "convite", desc: `Esse comando mostra o link para que você possa convidar o BOT para outros servidores
                
                Ex: **${"/"}convite**`
            },

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "convite", desc: `This command shows you the link so you can invite the BOT to other guilds
            
                Ex: **${"/"}convite**`
            },
            run: this.execute
        }
    }

    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "geral")
        int.deferReply({ ephemeral: secret })
            .then(() => {
                const inviteEmbed = new client.Discord.MessageEmbed()
                    .setDescription(client.tl({ local: int.lang + "inv-embedDesc" }))
                    .setFooter({text: client.resources.footer(), iconURL: client.user.displayAvatarURL()})
                    .setTimestamp()
                    .setColor(client.settings.color)

                const bInv = new client.Discord.MessageButton()
                    .setStyle(5)
                    .setLabel(client.tl({ local: int.lang + "inv-embedFT" }))
                    .setURL(`https://kamibot.vercel.app/short/convite`)

                int.editReply({ embeds: [inviteEmbed], components: [{ type: 1, components: [bInv] }] })
            })
    }
}