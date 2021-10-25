const moment = require("moment-timezone")
const toMs = require("milliseconds-parser")()

module.exports = {
    name: "interactionCreate",
    type: "djs",
    execute: async (client, interaction) => {
        if ((interaction.type == 'MESSAGE_COMPONENT')) { return client.emit("componentHandler", interaction) }
        if (!interaction.isCommand()) { return }

        interaction.author = interaction.user

        interaction.content = `${interaction.commandName} ${interaction.options._hoistedOptions.length > 0 ? interaction.options._hoistedOptions.map(i => i.value).join(' ') : ''}`.trim()

        interaction.slash = true

        const channel = client.channels.cache.get(interaction.channel.id)

        interaction.channel = channel

        interaction.pureReply = interaction.reply

        let response = false

        interaction.reply = async (x) => {

            x.allowedMentions = { repliedUser: false }

            if (x.mention) x.allowedMentions = { repliedUser: true }

            if (!response) {

                response = true
                try {
                    await interaction.deferReply()
                } catch {

                }

                return interaction.editReply(x)
            } else {
                const message = await interaction.fetchReply();

                x.reply = { messageReference: message.id }

                return await client.channels.cache.get(interaction.channel.id).send(x)
            }
        }

        interaction.delete = async function () {
            return await client.api
                .webhooks(client.user.id, interaction.token)
                .messages['@original'].delete();
        };

        interaction.slash = true
        interaction.ping = moment().valueOf() - interaction.createdTimestamp
        interaction.lang = client.utils.getLang(interaction)

        client.emit("messageCreate", interaction)
    }
}