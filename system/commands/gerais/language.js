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
        int.deferReply({ ephemeral: false })
            .then(async () => {
                if (!int.inGuild()) {
                    const lEmbedDm = new client.Discord.MessageEmbed()
                    lEmbedDm.setTitle(`Escolha que línguagem prefere usar meus comandos | Choose which language you prefer use my commands`)
                    lEmbedDm.setDescription(`
        Reaja na língua que preferir, lembrando que a linguaguem original é Pt-Br
        React in the language you prefer, remembering that the original language is Pt-Br

        Reaja em: 🇧🇷 para que todos os comandos em sua DM mudem para Pt-Br
        React at: 🇺🇸 so that all the commands in your DM change to En-Us
    
        **Mais línguas disponíveis em breve**
        **More languages available soon**`)
                    lEmbedDm.setColor(client.settings.color)

                    const uniqueID = `${Date.now()}`

                    const bPT = new client.Discord.MessageButton()
                        .setStyle(2)
                        .setLabel("PT-BR")
                        .setEmoji('🇧🇷')
                        .setCustomId("pt|" + uniqueID)

                    const bEN = new client.Discord.MessageButton()
                        .setStyle(2)
                        .setLabel("EN-US")
                        .setEmoji('🇺🇸')
                        .setCustomId("en|" + uniqueID)

                    const bCanc = new client.Discord.MessageButton()
                        .setStyle(4)
                        .setLabel("Cancelar | Cancel")
                        .setCustomId("canc|" + uniqueID)


                    int.editReply({ embeds: [lEmbedDm], components: [{ type: 1, components: [bPT, bEN, bCanc] }] })
                        .then(async () => {
                            const botmsg = await client.channels.fetch(int.channelId)
                            const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === int.user.id

                            botmsg.awaitMessageComponent({ filter, time: toMs.parse("2 minutos") })
                                .then(interaction => {
                                    interaction.deferUpdate()
                                    const choice = interaction.customId.split("|")[0]

                                    if (choice == "pt") {
                                        setLang(client, int, "user", "pt-")
                                        int.editReply({ content: client.tl({ local: `pt-eL-brDm` }), embeds: [], components: [] })
                                        return "pt-"
                                    }
                                    else if (choice == "en") {
                                        setLang(client, int, "user", "en-")
                                        int.editReply({ content: client.tl({ local: `en-eL-enDm` }), embeds: [], components: [] })
                                        return "en-"
                                    }
                                    else if (choice == "canc") {
                                        int.editReply({ content: `Ok, nada foi selecionado | Ok, nothing was selected`, embeds: [], components: [] })

                                        return
                                    }
                                })
                                .catch(err => {
                                    if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                        return int.editReply({ content: client.tl({ local: int.lang + "eL-sR", msg: int }), embeds: [], components: [] })
                                    }
                                    else {
                                        client.log.error(err, true)
                                        return
                                    }
                                })

                        })
                }
                else {
                    if (int.user.id != client.settings.owner) {
                        if (!int.member.permissions.has("ADMINISTRATOR") || !int.member.permissions.has("MANAGE_CHANNELS") || !int.member.permissions.has("MANAGE_GUILD")) {
                            return int.reply(client.tl({ local: int.lang + "onMsg-sPerm" }))
                        }
                    }
                    const lEmbed = new client.Discord.MessageEmbed()

                    var server = int.member.guild

                    lEmbed.setTitle(client.tl({ local: int.lang + "eL-embedTi", msg: int }))
                    lEmbed.setDescription(client.tl({ local: int.lang + "eL-embedDesc", msg: int }))
                    lEmbed.setColor(client.settings.color)

                    const uniqueID = `${Date.now()}`

                    const bPT = new client.Discord.MessageButton()
                        .setStyle(2)
                        .setLabel("PT-BR")
                        .setEmoji('🇧🇷')
                        .setDisabled(int.lang == "pt-")
                        .setCustomId("pt|" + uniqueID)

                    const bEN = new client.Discord.MessageButton()
                        .setStyle(2)
                        .setLabel("EN-US")
                        .setEmoji('🇺🇸')
                        .setDisabled(int.lang == "en-")
                        .setCustomId("en|" + uniqueID)

                    const bCanc = new client.Discord.MessageButton()
                        .setStyle(4)
                        .setLabel(client.tl({ local: int.lang + "bt-canc" }))
                        .setCustomId("canc|" + uniqueID)


                    int.editReply({ embeds: [lEmbed], components: [{ type: 1, components: [bPT, bEN, bCanc] }] })
                        .then(botmsg => {
                            const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === int.user.id

                            botmsg.awaitMessageComponent({ filter, time: toMs.parse("2 minutos") })
                                .then(interaction => {
                                    const choice = interaction.customId.split("|")[0]

                                    if (choice == "pt") {
                                        setLang(client, int, "server", "pt-")
                                        return int.editReply({ content: client.tl({ local: "pt-eL-br", msg: int }), embeds: [], components: [] })
                                    }
                                    else if (choice == "en") {
                                        setLang(client, int, "server", "en-")
                                        return int.editReply({ content: client.tl({ local: "en-eL-en", msg: int }), embeds: [], components: [] })
                                    }
                                    else if (choice == "canc") {
                                        return int.editReply({ content: client.tl({ local: int.lang + "eL-cancel", msg: int }), embeds: [], components: [] })
                                    }
                                })
                                .catch(err => {
                                    if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                        return int.editReply({ content: client.tl({ local: int.lang + "eL-sR", msg: int }), embeds: [], components: [] })
                                    }
                                    else {
                                        client.log.error(err, true)
                                        return
                                    }
                                })
                        })

                }
            })
    }
}