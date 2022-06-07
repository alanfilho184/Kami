const imageType = ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "gif", "gifV"]

module.exports = class adicionar_imagem {
    constructor() {
        return {
            ownerOnly: false,
            name: "Add imagem à ficha",
            fName: "Add imagem à ficha",
            fNameEn: "Add image to a sheet",
            desc: 'Adiciona a imagem da mensagem onde foi utilizado.',
            descEn: 'Adds the image of the message where it was used.',
            type: 3,
            helpPt: {
                title: "<:fichaAjuda:766790214550814770> " + "Apps > " + "Add imagem à ficha", desc: `
                Esta função serve para adicionar uma imagem à uma ficha sua que já tenha sido criada.

                Esta função irá pegar a primeira imagem em anexo da mensagem em que ela foi utilizada.

                Como utilizar:
                Passo 1 - Clique com o botão direito em uma mensagem que possua uma imagem.
                Passo 2 - Selecione \`Apps\` e depois \`Add imagem à ficha\`.
                Passo 3 - Selecione a ficha em que deseja adicionar a imagem no menu que irá aparecer.

                Pronto, a imagem será adicionada a sua ficha.
                `
            },

            helpEn: {
                title: "<:fichaAjuda:766790214550814770> " + "Apps > " + "Add imagem à ficha", desc: `
                This function is for adding an image to a sheet of yours that has already been created.

                This function will take the first attached image from the message in which it was used.

                How to use:
                Step 1 - Right click on a message that has an image.
                Step 2 - Select \`Apps\` and then \`Add imagem à ficha\`.
                Step 3 - Select the tab you want to add the image to from the drop-down menu that appears.

                There, the image will be added to your sheet.
                `
            },
            run: this.execute
        }
    }
    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(async () => {
                const msg = int.options._hoistedOptions[0].message
                const attach = Array.from(msg.attachments.values())[0]

                if (!attach || !imageType.includes(attach.contentType.split("/")[1])) {
                    int.editReply(client.tl({ local: int.lang + "addI-iNE" }))
                    return
                }
                else {
                    const fichas = client.cache.getFichasUser(int.user.id)

                    const uniqueID = `${Date.now()}`
                    const menu = new client.Discord.MessageSelectMenu()
                        .setCustomId("addImg|" + uniqueID)
                        .setPlaceholder(client.tl({ local: int.lang + "addI-mPH" }))

                    fichas.forEach(f => {
                        menu.addOptions({ label: f, value: f })
                    })

                    const embed = new client.Discord.EmbedBuilder()
                        .setTitle(client.tl({ local: int.lang + "addI-eTi" }))
                        .setDescription(client.tl({ local: int.lang + "addI-eDesc" }))
                        .setImage(attach.url)
                        .setColor(client.settings.color)
                        .setFooter({ text: client.resources.footer(), iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()

                    var botmsg = await int.editReply({ embeds: [embed], components: [{ type: 1, components: [menu] }] })

                    if (!int.inGuild()) { botmsg = await client.channels.fetch(int.channelId) }

                    var filter = (interaction) => interaction.user.id === int.user.id && interaction.customId.split("|")[1] === uniqueID
                    botmsg.awaitMessageComponent({ filter, time: 60000 })
                        .then((interaction) => {
                            interaction.deferUpdate()

                            const nomerpg = interaction.values[0]

                            client.cache.updateFicha(int.user.id, nomerpg, { imagem: attach.url }, { query: "update" })
                                .then(async r => {
                                    var infoUIRT = await client.cache.getIrt(int.user.id, nomerpg)

                                    if (infoUIRT != "") {
                                        client.emit("updtFicha", int, { id: int.user.id, nomerpg: nomerpg, irt: infoUIRT })
                                    }

                                    return int.editReply({ content: client.tl({ local: int.lang + "addI-iAdd" }), embeds: [], components: [] })
                                })
                        })
                        .catch(err => {
                            if (err.code == "INTERACTION_COLLECTOR_ERROR") {
                                int.editReply({ components: [] })
                            }
                            else {
                                client.logs.error(err, true)
                            }
                        })
                }
            })
    }
}