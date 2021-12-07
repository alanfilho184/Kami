const toMs = require("milliseconds-parser")()
const setLang = require("../../resources/scripts/lang").setLang

module.exports = class lang {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
                user: [],
                owner: false,
            },
            name: "linguagem",
            cat: "Linguagem",
            catEn: "Language",
            desc: 'Altera o idioma do BOT.',
            descEn: 'Changes the BOT\' language.',
            aliases: ['linguagem', 'language'],
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

    async execute(client, msg) {
        if (msg.channel.type == "DM") {
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

            async function react(msg) {

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

                msg.author.send({ embeds: [lEmbedDm], components: [{ type: 1, components: [bPT, bEN, bCanc] }] })
                    .then(botmsg => {

                        const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === msg.author.id

                        botmsg.awaitMessageComponent({ filter, time: toMs.parse("2 minutos") })
                            .then(interaction => {
                                const choice = interaction.customId.split("|")[0]

                                if (choice == "pt") {
                                    setLang(client, msg, "user", "pt-")
                                    botmsg.edit({ content: client.tl({ local: `pt-eL-brDm` }), embeds: [], components: [] })
                                    return "pt-"
                                }
                                else if (choice == "en") {
                                    setLang(client, msg, "user", "en-")
                                    botmsg.edit({ content: client.tl({ local: `en-eL-enDm` }), embeds: [], components: [] })
                                    return "en-"
                                }
                                else if (choice == "canc") {
                                    botmsg.edit({ content: `Ok, nada foi selecionado | Ok, nothing was selected`, embeds: [], components: [] })

                                    return
                                }
                            })
                            // .catch(err => {
                            //     if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                            //         return botmsg.edit({ content: client.tl({ local: msg.lang + "eL-sR", msg: msg }), embeds: [], components: [] })
                            //     }
                            //     else {
                            //         client.log.error(err, true)
                            //         return
                            //     }
                            // })
                    })

            }

            react(msg)
        }
        if (msg.channel.type == "GUILD_TEXT") {

            if (msg.author.id != client.settings.owner) {
                if (!msg.member.permissions.has("ADMINISTRATOR") || !msg.member.permissions.has("MANAGE_CHANNELS") || !msg.member.permissions.has("MANAGE_GUILD")) {
                    return msg.reply(client.tl({ local: msg.lang + "onMsg-sPerm" }))
                }
            }
            const lEmbed = new client.Discord.MessageEmbed()

            var server = msg.guild

            lEmbed.setTitle(client.tl({ local: msg.lang + "eL-embedTi", msg: msg }))
            lEmbed.setDescription(client.tl({ local: msg.lang + "eL-embedDesc", msg: msg }))
            lEmbed.setColor(client.settings.color)

            async function react(msg) {
                const uniqueID = `${Date.now()}`

                const bPT = new client.Discord.MessageButton()
                    .setStyle(2)
                    .setLabel("PT-BR")
                    .setEmoji('🇧🇷')
                    .setDisabled(msg.lang == "pt-")
                    .setCustomId("pt|" + uniqueID)

                const bEN = new client.Discord.MessageButton()
                    .setStyle(2)
                    .setLabel("EN-US")
                    .setEmoji('🇺🇸')
                    .setDisabled(msg.lang == "en-")
                    .setCustomId("en|" + uniqueID)

                const bCanc = new client.Discord.MessageButton()
                    .setStyle(4)
                    .setLabel(client.tl({ local: msg.lang + "bt-canc" }))
                    .setCustomId("canc|" + uniqueID)


                msg.reply({ embeds: [lEmbed], components: [{ type: 1, components: [bPT, bEN, bCanc] }] })
                    .then(botmsg => {

                        const filter = (interaction) => interaction.customId.split("|")[1] === uniqueID && interaction.user.id === msg.author.id

                        botmsg.awaitMessageComponent({ filter, time: toMs.parse("2 minutos") })
                            .then(interaction => {
                                const choice = interaction.customId.split("|")[0]

                                if (choice == "pt") {
                                    setLang(client, msg, "server", "pt-")
                                    return botmsg.edit({ content: client.tl({ local: "pt-eL-br", msg: msg }), embeds: [], components: [] })
                                }
                                else if (choice == "en") {
                                    setLang(client, msg, "server", "en-")
                                    return botmsg.edit({ content: client.tl({ local: "en-eL-en", msg: msg }), embeds: [], components: [] })
                                }
                                else if (choice == "canc") {
                                    return botmsg.edit({ content: client.tl({ local: msg.lang + "eL-cancel", msg: msg }), embeds: [], components: [] })
                                }
                            })
                            .catch(err => {
                                if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                    return botmsg.edit({ content: client.tl({ local: msg.lang + "eL-sR", msg: msg }), embeds: [], components: [] })
                                }
                                else {
                                    client.log.error(err, true)
                                    return
                                }
                            })
                    })

            }

            react(msg)
        }
    }
}