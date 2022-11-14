const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('discord.js');
const { Routes } = require('discord-api-types/v9');

module.exports = class reloadSlash {

    constructor() {
        return {
            ownerOnly: true,
            name: "reloadslashs",
            fName: "Reload Slashs",
            desc: 'Recarrega os slash commands do BOT.',
            args: [],
            options: [],
            type: 1,
            run: this.execute
        }
    }

    async execute(client, int) {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        const slashs = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        )

        const commands = new Array()
        const commandsOwner = new Array()

        client.commands.forEach(c => {
            if (c.type == 1) {
                const command = new SlashCommandBuilder()

                if (c.ownerOnly) {
                    command.setDefaultMemberPermissions('0')
                    command.setName(c.name).setDescription(c.desc)

                    if (c.args.length > 0) {
                        for (var x in c.args) {
                            if (c.args[x].type == "STRING") {
                                command.addStringOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required).setAutocomplete(c.args[x].autocomplete))
                            }
                            else if (c.args[x].type == "INTEGER") {
                                command.addIntegerOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required).setAutocomplete(c.args[x].autocomplete))
                            }
                            else if (c.args[x].type == "USER") {
                                command.addUserOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                            }
                            else if (c.args[x].type == "ATTACHMENT") {
                                command.addAttachmentOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                            }
                        }
                    }

                    if (c.options.length > 0) {
                        for (var x in c.options) {
                            if (c.options[x].type == "STRING") {
                                command.addStringOption(option => {
                                    option.setName(c.options[x].name).setRequired(c.options[x].required).setDescription(c.options[x].desc)

                                    if (c.options[x].choices.length > 0) {
                                        for (var y in c.options[x].choices) {
                                            option.addChoices({ name: c.options[x].choices[y].name, value: c.options[x].choices[y].return })
                                        }
                                    }

                                    return option
                                })
                            }
                        }
                    }

                    commandsOwner.push(command)
                }
                else {
                    command.setDefaultMemberPermissions()
                    command.setName(c.name).setDescription(c.desc)

                    for (var x in slashs) {
                        if (slashs[x].name == c.name) {
                            command.id = slashs[x].id
                        }
                    }

                    if (c.args.length > 0) {
                        for (var x in c.args) {
                            if (c.args[x].type == "STRING") {
                                command.addStringOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required).setAutocomplete(c.args[x].autocomplete))
                            }
                            else if (c.args[x].type == "INTEGER") {
                                command.addIntegerOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required).setAutocomplete(c.args[x].autocomplete))
                            }
                            else if (c.args[x].type == "USER") {
                                command.addUserOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                            }
                            else if (c.args[x].type == "ATTACHMENT") {
                                command.addAttachmentOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                            }
                        }
                    }

                    if (c.options.length > 0) {
                        for (var x in c.options) {
                            if (c.options[x].type == "STRING") {
                                command.addStringOption(option => {
                                    option.setName(c.options[x].name).setDescription(c.options[x].desc).setRequired(c.options[x].required)

                                    if (c.options[x].choices.length > 0) {
                                        for (var y in c.options[x].choices) {
                                            option.addChoices({ name: c.options[x].choices[y].name, value: c.options[x].choices[y].return })
                                        }
                                    }

                                    return option
                                })
                            }
                        }
                    }

                    commands.push(command)
                }
            }
            else if (c.type == 3) {
                const command = new ContextMenuCommandBuilder()

                if (c.ownerOnly) {
                    command.setDefaultMemberPermissions('0')
                    command.setName(c.name)
                    command.setType(c.type)

                    commandsOwner.push(command)
                }
                else {
                    command.setDefaultMemberPermissions()
                    command.setName(c.name)
                    command.setType(c.type)

                    commands.push(command)
                }
            }
        })

        try {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            )

        } catch (error) {
            client.log.error(error, true)
        }

        try {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, "717173630110400515"),
                { body: commandsOwner },
            )
        } catch (error) {
            client.log.error(error, true)
        }

        int.reply("Slash commands recarregados")
    }
}
