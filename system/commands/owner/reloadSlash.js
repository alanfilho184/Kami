const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v9');

const types = {
    "SUB_COMMAND": 1,
    "SUB_COMMAND_GROUP": 2,
    "STRING": 3,
    "INTEGER": 4,
    "BOOLEAN": 5,
    "USER": 6,
    "CHANNEL": 7,
    "ROLE": 8,
    "MENTIONABLE": 9,
    "NUMBER": 10,
}

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

    execute(client, int) {
        int.deferReply({ ephemeral: true })
            .then(async () => {
                const rest = new REST({ version: '9' }).setToken(client.settings.token);

                const slashs = await rest.get(
                    Routes.applicationCommands(client.settings.clientId)
                )

                const commands = new Array()
                const commandsOwner = new Array()

                client.commands.forEach(c => {
                    if (c.type == 1) {
                        const command = new SlashCommandBuilder()

                        if (c.ownerOnly) {
                            command.setDefaultPermission(false)
                            command.setName(c.name).setDescription(c.desc)

                            if (c.args.length > 0) {
                                for (var x in c.args) {
                                    if (c.args[x].type == "STRING") {
                                        command.addStringOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                                    }
                                    else if (c.args[x].type == "INTEGER") {
                                        command.addIntegerOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                                    }
                                    else if (c.args[x].type == "USER") {
                                        command.addUserOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
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
                                                    option.addChoice(c.options[x].choices[y].name, c.options[x].choices[y].return)
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
                            command.setDefaultPermission(true)
                            command.setName(c.name).setDescription(c.desc)

                            for (x in slashs) {
                                if (slashs[x].name == c.name) {
                                    command.id = slashs[x].id
                                }
                            }

                            if (c.args.length > 0) {
                                for (var x in c.args) {
                                    if (c.args[x].type == "STRING") {
                                        command.addStringOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                                    }
                                    else if (c.args[x].type == "INTEGER") {
                                        command.addIntegerOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
                                    }
                                    else if (c.args[x].type == "USER") {
                                        command.addUserOption(option => option.setName(c.args[x].name).setDescription(c.args[x].desc).setRequired(c.args[x].required))
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
                                                    option.addChoice(c.options[x].choices[y].name, c.options[x].choices[y].return)
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
                            command.setDefaultPermission(false)
                            command.setName(c.name)
                            command.setType(c.type)

                            commandsOwner.push(command)
                        }
                        else {
                            command.setDefaultPermission(true)
                            command.setName(c.name)
                            command.setType(c.type)

                            commands.push(command)
                        }
                    }
                })

                try {
                    await rest.put(
                        Routes.applicationCommands(client.settings.clientId),
                        { body: commands },
                    )

                } catch (error) {
                    console.error(error);
                }

                try {
                    await rest.put(
                        Routes.applicationGuildCommands(client.settings.clientId, "717173630110400515"),
                        { body: commandsOwner },
                    )
                        .then(async r => {
                            var commands = await client.guilds.cache.get("717173630110400515").commands.fetch()

                            commands.forEach(async c => {

                                const command = await client.guilds.cache.get("717173630110400515").commands.fetch(c.id);

                                const permissions = [
                                    {
                                        id: client.settings.owner,
                                        type: 'USER',
                                        permission: true,
                                    },
                                ];

                                await command.permissions.add({ permissions })
                            })
                        })

                } catch (error) {
                    console.error(error);
                }

                int.editReply("Slash commands recarregados")

            })
    }
}
