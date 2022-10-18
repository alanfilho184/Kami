const toMs = require("milliseconds-parser")()
const setLang = require("../../resources/scripts/lang").setLang

module.exports = class lang {
    constructor() {
        return {
            ownerOnly: false,
            name: "linguagem",
            fName: "Linguagem",
            fNameEn: "Language",
            desc: 'Altera o idioma do BOT.',
            descEn: 'Changes the BOT\' language.',
            args: [],
            options: [],
            type: 1,
            helpPt: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "linguagem", desc: `
            Esse comando serve para que você possa escolher em qual linguagem prefere utilizar os comandos, basta utiliza-ló e reagir no idioma que preferir
        
            Ex: **${"/"}linguagem**
        
            Atualmente, os idiomas disponíveis são:
            🇧🇷 PT-BR,
            🇺🇸 EN-US`},

            helpEn: {
                title: "<:outrosAjuda:766790214110019586> " + "/" + "linguagem", desc: `
            This command is for you to choose in which language you prefer to use the commands, just use it and react in the language you prefer
        
            Ex: **${"/"}linguagem**
        
            Currently, the available languages are:
            🇧🇷 PT-BR,
            🇺🇸 EN-US`},
            run: this.execute
        }
    }

    execute(client, int) {
        const secret = client.utils.secret(client.cache.get(int.user.id), "geral")
        int.deferReply({ ephemeral: secret })
            .then(async () => {
                const local = int.inGuild() ? "server" : "user"

                if (local == "server") {
                    if (int.user.id != process.env.OWNER) {
                        if (!int.member.permissions.has(client.Discord.PermissionsBitField.Flags.Administrator) || !int.member.permissions.has(client.Discord.PermissionsBitField.Flags.ManageChannels) || !int.member.permissions.has(client.Discord.PermissionsBitField.Flags.ManageGuild)) {
                            return int.editReply(client.tl({ local: int.lang + "onMsg-sPerm" }))
                        }
                    }
                }

                const lEmbed = new client.Discord.EmbedBuilder()
                    .setTitle(client.tl({ local: int.lang + "eL-embedTi" }))
                    .setDescription(client.tl({ local: int.lang + "eL-embedDesc" }))
                    .setColor(parseInt(process.env.EMBED_COLOR))
                    .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })

                const uniqueID = `${Date.now()}`

                const bPT = new client.Discord.ButtonBuilder()
                    .setStyle(2)
                    .setLabel("PT-BR")
                    .setEmoji('🇧🇷')
                    .setDisabled(int.lang == "pt-")
                    .setCustomId("pt|" + uniqueID)

                const bEN = new client.Discord.ButtonBuilder()
                    .setStyle(2)
                    .setLabel("EN-US")
                    .setEmoji('🇺🇸')
                    .setDisabled(int.lang == "en-")
                    .setCustomId("en|" + uniqueID)

                const bCanc = new client.Discord.ButtonBuilder()
                    .setStyle(4)
                    .setLabel(client.tl({ local: int.lang + "bt-canc" }))
                    .setCustomId("canc|" + uniqueID)

                int.editReply({ embeds: [lEmbed], components: [{ type: 1, components: [bPT, bEN, bCanc] }] })
                    .then(async botmsg => {
                        botmsg = await client.channels.fetch(int.channelId)
                        const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === int.user.id

                        botmsg.awaitMessageComponent({ filter, time: toMs.parse("2 minutos") })
                            .then(interaction => {
                                const choice = interaction.customId.split("|")[0]

                                if (choice == "pt") {
                                    setLang(client, int, local, "pt-")
                                    return int.editReply({ content: client.tl({ local: `pt-eL-br${int.inGuild() ? "" : "Dm"}` }), embeds: [], components: [] })
                                }
                                else if (choice == "en") {
                                    setLang(client, int, local, "en-")
                                    return int.editReply({ content: client.tl({ local: `en-eL-en${int.inGuild() ? "" : "Dm"}`}), embeds: [], components: [] })
                                }
                                else if (choice == "canc") {
                                    return int.editReply({ content: client.tl({ local: int.lang + "eL-cancel" }), embeds: [], components: [] })
                                }
                            })
                            .catch(err => {
                                if (err.code == "InteractionCollectorError") {
                                    return int.editReply({ content: client.tl({ local: int.lang + "eL-sR" }), embeds: [], components: [] })
                                }
                                else {
                                    client.log.error(err, true)
                                    return
                                }
                            })
                    })
            })
    }
}