import {
    SlashCommandBuilder,
    SlashCommandStringOption,
    SlashCommandIntegerOption,
    SlashCommandUserOption,
    SlashCommandAttachmentOption,
    ContextMenuCommandBuilder
} from '@discordjs/builders';
import rest from '../../configs/rest';
import { Locale, Routes } from 'discord-api-types/v10';
import { Interaction } from '../../resources/utils/interaction-handler';
import commandsBot from '..';
import logger from '../../configs/logger';

function languageFilter(language: string | any) {
    language = language.replace('_', '-').split('-');

    if (language.length > 1) {
        language = language[0] + '-' + language[1].toUpperCase();
    } else {
        language = language[0];
    }

    return language;
}

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'reloadslashs',
        en_us: 'reloadslashs'
    },
    fullNames: {
        pt_br: 'Reload Slashs',
        en_us: 'Reload Slashs'
    },
    descriptions: {
        pt_br: 'Recarrega os comandos do bot',
        en_us: 'Reloads the bot commands'
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        const slashs: any = await rest.get(Routes.applicationCommands(int.application_id));

        const commands = new Array();
        const commandsOwnerOnly = new Array();

        commandsBot.forEach(command => {
            if (command.type == 1) {
                const newCommand = new SlashCommandBuilder();

                for (let s in slashs) {
                    if (slashs[s].name == command.commandNames['en_us']) {
                        //@ts-ignore
                        newCommand.id = slashs[s].id;
                    }
                }

                if (command.ownerOnly) {
                    newCommand.setDefaultMemberPermissions('0');
                    newCommand.setName(command.commandNames['en_us']).setDescription(command.descriptions['en_us']);

                    if (command.arguments) {
                        for (let a in command.arguments['en_us']) {
                            if (command.arguments['en_us'][a].type == 'STRING') {
                                newCommand.addStringOption((option: SlashCommandStringOption) => {
                                    option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required);

                                    if (
                                        command.arguments!['en_us'][a].choices &&
                                        command.arguments!['en_us'][a].choices.length > 0
                                    ) {
                                        for (let c in command.arguments!['en_us'][a].choices) {
                                            option.addChoices({
                                                name: command.arguments!['en_us'][a].choices[c].name,
                                                value: `${command.arguments!['en_us'][a].choices[c].return}`
                                            });
                                        }
                                    } else if (command.arguments!['en_us'][a].autocomplete) {
                                        option.setAutocomplete(command.arguments!['en_us'][a].autocomplete);
                                    }

                                    return option;
                                });
                            }
                            //@ts-ignore
                            else if (command.arguments['en_us'][a].type == 'INTEGER') {
                                newCommand.addIntegerOption((option: SlashCommandIntegerOption) => {
                                    return option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required)
                                        .setAutocomplete(command.arguments!['en_us'][a].autocomplete);
                                });
                            }
                            //@ts-ignore
                            else if (command.arguments['en_us'][a].type == 'USER') {
                                newCommand.addUserOption((option: SlashCommandUserOption) => {
                                    return option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required);
                                });
                            }
                            //@ts-ignore
                            else if (command.arguments['en_us'][a].type == 'ATTACHMENT') {
                                newCommand.addAttachmentOption((option: SlashCommandAttachmentOption) => {
                                    return option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required);
                                });
                            }
                        }
                    }

                    // if (command.options) {
                    //     for (let o in command.options['en_us']) {
                    //         if (command.options['en_us'][o].type == 'STRING') {
                    //             newCommand.addStringOption((option: SlashCommandStringOption) => {
                    //                 option
                    //                     .setName(command.options!['en_us'][o].name)
                    //                     .setDescription(command.options!['en_us'][o].description)
                    //                     .setRequired(command.options!['en_us'][o].required);

                    //                 if (command.options!['en_us'][o].choices) {
                    //                     for (let c in command.options!['en_us'][o].choices) {
                    //                         option.addChoices({
                    //                             name: command.options!['en_us'][o].choices[c].name,
                    //                             value: `${command.options!['en_us'][o].choices[c].return}`
                    //                         });
                    //                     }
                    //                 }

                    //                 return option;
                    //             });
                    //         }
                    //     }
                    // }

                    commandsOwnerOnly.push(newCommand);
                } else {
                    newCommand.setDefaultMemberPermissions(null);
                    newCommand.setName(command.commandNames['en_us']).setDescription(command.descriptions['en_us']);

                    for (let language in command.commandNames) {
                        const name = command.commandNames[language];
                        const description = command.descriptions[language];

                        language = languageFilter(language);

                        if (!Object.values(Locale).includes(language as Locale)) {
                            throw new Error(`Invalid language: ${language}`);
                        } else {
                            //@ts-ignore
                            newCommand
                                .setNameLocalization(language as Locale, name)
                                .setDescriptionLocalization(language as Locale, description);
                        }
                    }

                    if (command.arguments) {
                        const localizedArgsNames: any = {};
                        const localizedArgsDescriptions: any = {};

                        for (let i = 0; i < Object.keys(command.arguments['en_us']).length; i++) {
                            const argEn = command.arguments['en_us'][i].name;

                            for (let language of Object.keys(command.arguments)) {
                                const arg = command.arguments[language][i];

                                language = languageFilter(language);

                                if (!localizedArgsNames[argEn]) {
                                    localizedArgsNames[argEn] = {};
                                }

                                if (!localizedArgsDescriptions[argEn]) {
                                    localizedArgsDescriptions[argEn] = {};
                                }

                                localizedArgsNames[argEn][language] = arg.name;
                                localizedArgsDescriptions[argEn][language] = arg.description;
                            }
                        }

                        for (let a in command.arguments['en_us']) {
                            if (command.arguments['en_us'][a].type == 'STRING') {
                                if (
                                    command.arguments['en_us'][a].autocomplete &&
                                    command.arguments['en_us'][a].choices &&
                                    command.arguments['en_us'][a].choices.length > 0
                                ) {
                                    throw new Error(
                                        `Argument ${command.arguments['en_us'][a].name} has choices and autocomplete`
                                    );
                                }

                                const localizedOptionsChoicesNames: any = {};
                                if (!command.arguments['en_us'][a].choices) {
                                    for (let i = 0; i < Object.keys(command.arguments['en_us']).length; i++) {
                                        const argEn = command.arguments['en_us'][i].name;

                                        for (let language of Object.keys(command.arguments)) {
                                            const arg = command.arguments[language][i];

                                            if (arg.choices) {
                                                language = languageFilter(language);

                                                if (!localizedOptionsChoicesNames[argEn]) {
                                                    localizedOptionsChoicesNames[argEn] = {};
                                                }

                                                localizedOptionsChoicesNames[argEn][language] = {};

                                                for (let c in arg.choices) {
                                                    localizedOptionsChoicesNames[argEn][language][
                                                        arg.choices[c].return
                                                    ] = arg.choices[c].name;
                                                }
                                            }
                                        }
                                    }
                                }

                                newCommand.addStringOption((option: SlashCommandStringOption) => {
                                    option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required)
                                        .setNameLocalizations(localizedArgsNames[command.arguments!['en_us'][a].name])
                                        .setDescriptionLocalizations(
                                            localizedArgsDescriptions[command.arguments!['en_us'][a].name]
                                        );

                                    if (
                                        command.arguments!['en_us'][a].choices &&
                                        command.arguments!['en_us'][a].choices.length > 0
                                    ) {
                                        if (command.arguments!['en_us'][a].choices) {
                                            for (let c in command.arguments!['en_us'][a].choices) {
                                                const choice = command.arguments!['en_us'][a].choices![c];

                                                const choiceNameLocalizations = {};

                                                for (let language of Object.keys(command.arguments!)) {
                                                    const filteredLang = languageFilter(language);
                                                    const choices = command.arguments![language][a].choices;
                                                    if (choices) {
                                                        const matchingChoice = choices.find(
                                                            c => c.return === choice.return
                                                        );
                                                        if (matchingChoice) {
                                                            choiceNameLocalizations[filteredLang] = matchingChoice.name;
                                                        }
                                                    }
                                                }

                                                option.addChoices({
                                                    name: command.arguments!['en_us'][a].choices![c].name,
                                                    value: `${command.arguments!['en_us'][a].choices![c].return}`,
                                                    name_localizations: choiceNameLocalizations
                                                });
                                            }
                                        }
                                    } else if (command.arguments!['en_us'][a].autocomplete) {
                                        option.setAutocomplete(command.arguments!['en_us'][a].autocomplete);
                                    }

                                    return option;
                                });
                            }
                            //@ts-ignore
                            else if (command.arguments['en_us'][a].type == 'INTEGER') {
                                newCommand.addIntegerOption((option: SlashCommandIntegerOption) => {
                                    option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required)
                                        .setAutocomplete(command.arguments!['en_us'][a].autocomplete)
                                        .setNameLocalizations(localizedArgsNames[command.arguments!['en_us'][a].name])
                                        .setDescriptionLocalizations(
                                            localizedArgsDescriptions[command.arguments!['en_us'][a].name]
                                        );

                                    return option;
                                });
                            }
                            //@ts-ignore
                            else if (command.arguments['en_us'][a].type == 'USER') {
                                newCommand.addUserOption((option: SlashCommandUserOption) => {
                                    option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required)
                                        .setNameLocalizations(localizedArgsNames[command.arguments!['en_us'][a].name])
                                        .setDescriptionLocalizations(
                                            localizedArgsDescriptions[command.arguments!['en_us'][a].name]
                                        );

                                    return option;
                                });
                            }
                            //@ts-ignore
                            else if (command.arguments['en_us'][a].type == 'ATTACHMENT') {
                                newCommand.addAttachmentOption((option: SlashCommandAttachmentOption) => {
                                    option
                                        .setName(command.arguments!['en_us'][a].name)
                                        .setDescription(command.arguments!['en_us'][a].description)
                                        .setRequired(command.arguments!['en_us'][a].required)
                                        .setNameLocalizations(localizedArgsNames[command.arguments!['en_us'][a].name])
                                        .setDescriptionLocalizations(
                                            localizedArgsDescriptions[command.arguments!['en_us'][a].name]
                                        );

                                    return option;
                                });
                            }
                        }
                    }

                    // if (command.options) {
                    //     const localizedOptionsNames: any = {};
                    //     const localizedOptionsDescriptions: any = {};

                    //     for (let i = 0; i < Object.keys(command.options['en_us']).length; i++) {
                    //         const argEn = command.options['en_us'][i].name;

                    //         for (let language of Object.keys(command.options)) {
                    //             const arg = command.options[language][i];

                    //             language = languageFilter(language);

                    //             if (!localizedOptionsNames[argEn]) {
                    //                 localizedOptionsNames[argEn] = {};
                    //             }

                    //             if (!localizedOptionsDescriptions[argEn]) {
                    //                 localizedOptionsDescriptions[argEn] = {};
                    //             }

                    //             localizedOptionsNames[argEn][language] = arg.name;
                    //             localizedOptionsDescriptions[argEn][language] = arg.description;
                    //         }
                    //     }

                    //     const localizedOptionsChoicesNames: any = {};

                    //     for (let i = 0; i < Object.keys(command.options['en_us']).length; i++) {
                    //         const argEn = command.options['en_us'][i].name;

                    //         for (let language of Object.keys(command.options)) {
                    //             const arg = command.options[language][i];

                    //             language = languageFilter(language);

                    //             if (!localizedOptionsChoicesNames[argEn]) {
                    //                 localizedOptionsChoicesNames[argEn] = {};
                    //             }

                    //             localizedOptionsChoicesNames[argEn][language] = {};

                    //             if (arg.choices) {
                    //                 for (let c in arg.choices) {
                    //                     localizedOptionsChoicesNames[argEn][language][arg.choices[c].return] =
                    //                         arg.choices[c].name;
                    //                 }
                    //             }
                    //         }
                    //     }

                    //     for (let o in command.options['en_us']) {
                    //         if (command.options['en_us'][o].type == 'STRING') {
                    //             newCommand.addStringOption((option: SlashCommandStringOption) => {
                    //                 option
                    //                     .setName(command.options!['en_us'][o].name)
                    //                     .setDescription(command.options!['en_us'][o].description)
                    //                     .setRequired(command.options!['en_us'][o].required)
                    //                     .setNameLocalizations(localizedOptionsNames[command.options!['en_us'][o].name])
                    //                     .setDescriptionLocalizations(
                    //                         localizedOptionsDescriptions[command.options!['en_us'][o].name]
                    //                     );

                    //                 if (command.options!['en_us'][o].choices) {
                    //                     for (let c in command.options!['en_us'][o].choices) {
                    //                         const optionName = command.options!['en_us'][o].name;
                    //                         const choice = command.options!['en_us'][o].choices[c];

                    //                         const choiceNameLocalizations = {};

                    //                         for (let language in localizedOptionsChoicesNames[optionName]) {
                    //                             choiceNameLocalizations[language] =
                    //                                 localizedOptionsChoicesNames[optionName][language][choice.return];
                    //                         }

                    //                         option.addChoices({
                    //                             name: command.options!['en_us'][o].choices[c].name,
                    //                             value: `${command.options!['en_us'][o].choices[c].return}`,
                    //                             name_localizations: choiceNameLocalizations
                    //                         });
                    //                     }
                    //                 }

                    //                 return option;
                    //             });
                    //         }
                    //     }
                    // }

                    commands.push(newCommand);
                }
            } else if (command.type == 3) {
                const newCommand = new ContextMenuCommandBuilder();

                if (command.ownerOnly) {
                    newCommand.setDefaultMemberPermissions('0');
                    newCommand.setName(command.commandNames['en_us']);
                    newCommand.setType(command.type);

                    commandsOwnerOnly.push(newCommand);
                } else {
                    newCommand.setDefaultMemberPermissions(null);
                    newCommand.setName(command.commandNames['en_us']);
                    newCommand.setType(command.type);

                    for (let language in command.commandNames) {
                        const name = command.commandNames[language];

                        language = languageFilter(language);

                        if (!Object.values(Locale).includes(language as Locale)) {
                            throw new Error(`Invalid language: ${language}`);
                        } else {
                            //@ts-ignore
                            newCommand.setNameLocalization(language, name);
                        }
                    }

                    commands.push(newCommand);
                }
            }
        });

        try {
            await rest.put(Routes.applicationCommands(int.application_id), { body: commands });
        } catch (err) {
            logger.logText('ERROR', err);
            return int.reply({ content: 'Erro ao recarregar os comandos' });
        }

        try {
            await rest.put(Routes.applicationGuildCommands(int.application_id, '717173630110400515'), {
                body: commandsOwnerOnly
            });
        } catch (err) {
            logger.logText('ERROR', err);
            return int.reply({ content: 'Erro ao recarregar os comandos ownerOnly' });
        }

        int.reply({ content: 'Comandos recarregados' });
    }
};
