import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { DateTime } from 'luxon';
import rest from '../../configs/rest';
import { ButtonStyle, Routes } from 'discord-api-types/v10';
import { Available_Languages } from '../../types/enums';
import actionHandler from '../../resources/utils/action-handler';
import { randomUUID } from 'crypto';
import UserController from '../../controllers/user.controller';

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'config',
        en_us: 'config'
    },
    fullNames: {
        pt_br: 'config',
        en_us: 'config'
    },
    descriptions: {
        pt_br: 'Configurações de comandos do BOT.',
        en_us: 'BOT command settings.'
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        function createConfig(language: Available_Languages, preferences: Partial<User_Config>, tempId?: string) {
            if (preferences.language == null) {
                preferences.language == language;
            }

            const configEmbed = new EmbedBuilder()
                .setTitle(localization(language, 'cmd-config|embed-title'))
                .setColor(parseInt(config.EMBED_COLOR));

            let currentLanguage = '';

            switch (`${preferences.language}`.toLowerCase()) {
                case 'en_us':
                    currentLanguage = 'en_us';
                    break;
                case 'pt_br':
                    currentLanguage = 'pt_br';
                    break;
                default:
                    currentLanguage = `${language}`.toLowerCase();
            }

            configEmbed.addFields(
                {
                    name: localization(language, 'cmd-config|general-title'),
                    value: preferences.secret_general
                        ? localization(language, 'cmd-config|value-enabled')
                        : localization(language, 'cmd-config|value-disabled'),
                    inline: false
                },
                {
                    name: localization(language, 'cmd-config|insan-title'),
                    value: preferences.secret_insan
                        ? localization(language, 'cmd-config|value-enabled')
                        : localization(language, 'cmd-config|value-disabled'),
                    inline: false
                },
                {
                    name: localization(language, 'cmd-config|roll-title'),
                    value: preferences.secret_roll
                        ? localization(language, 'cmd-config|value-enabled')
                        : localization(language, 'cmd-config|value-disabled'),
                    inline: false
                },
                {
                    name: localization(language, 'cmd-config|send-title'),
                    value: preferences.secret_send
                        ? localization(language, 'cmd-config|value-enabled')
                        : localization(language, 'cmd-config|value-disabled'),
                    inline: false
                },
                {
                    name: localization(language, 'cmd-config|sheet-title'),
                    value: preferences.secret_sheet
                        ? localization(language, 'cmd-config|value-enabled')
                        : localization(language, 'cmd-config|value-disabled'),
                    inline: false
                },
                {
                    name: localization(language, 'cmd-config|language-title'),
                    value:
                        currentLanguage == 'pt_br'
                            ? localization(language, 'cmd-config|language-pt-br')
                            : localization(language, 'cmd-config|language-en-us'),
                    inline: false
                }
            );

            configEmbed.setDescription(localization(language, 'cmd-config|description'));

            tempId = tempId ? tempId : randomUUID();

            const toggleGeneralButton = new ButtonBuilder()
                .setCustomId(`$a$config-toggle-sec-gen|${tempId}`)
                .setLabel(
                    preferences.secret_general
                        ? localization(language, 'cmd-config|button-general-disable')
                        : localization(language, 'cmd-config|button-general-enable')
                )
                .setStyle(preferences.secret_general ? ButtonStyle.Danger : ButtonStyle.Success);

            const toggleInsanButton = new ButtonBuilder()
                .setCustomId(`$a$config-toggle-sec-insan|${tempId}`)
                .setLabel(
                    preferences.secret_insan
                        ? localization(language, 'cmd-config|button-insan-disable')
                        : localization(language, 'cmd-config|button-insan-enable')
                )
                .setStyle(preferences.secret_insan ? ButtonStyle.Danger : ButtonStyle.Success);

            const toggleRollButton = new ButtonBuilder()
                .setCustomId(`$a$config-toggle-sec-roll|${tempId}`)
                .setLabel(
                    preferences.secret_roll
                        ? localization(language, 'cmd-config|button-roll-disable')
                        : localization(language, 'cmd-config|button-roll-enable')
                )
                .setStyle(preferences.secret_roll ? ButtonStyle.Danger : ButtonStyle.Success);

            const toggleSendButton = new ButtonBuilder()
                .setCustomId(`$a$config-toggle-sec-send|${tempId}`)
                .setLabel(
                    preferences.secret_send
                        ? localization(language, 'cmd-config|button-send-disable')
                        : localization(language, 'cmd-config|button-send-enable')
                )
                .setStyle(preferences.secret_send ? ButtonStyle.Danger : ButtonStyle.Success);

            const toggleSheetButton = new ButtonBuilder()
                .setCustomId(`$a$config-toggle-sec-sheet|${tempId}`)
                .setLabel(
                    preferences.secret_sheet
                        ? localization(language, 'cmd-config|button-sheet-disable')
                        : localization(language, 'cmd-config|button-sheet-enable')
                )
                .setStyle(preferences.secret_sheet ? ButtonStyle.Danger : ButtonStyle.Success);

            const toggleLangButton = new ButtonBuilder()
                .setCustomId(`$a$config-toggle-lang|${tempId}`)
                .setLabel(
                    currentLanguage == 'en_us'
                        ? localization(language, 'cmd-config|button-language-pt-br')
                        : localization(language, 'cmd-config|button-language-en-us')
                )
                .setStyle(ButtonStyle.Primary);

            const actionRow1 = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(toggleGeneralButton)
                .addComponents(toggleInsanButton)
                .addComponents(toggleRollButton)
                .addComponents(toggleSendButton)
                .addComponents(toggleSheetButton);
            const actionRow2 = new ActionRowBuilder<ButtonBuilder>().addComponents(toggleLangButton);

            return {
                embed: configEmbed,
                actionRows: [actionRow1, actionRow2],
                tempId
            };
        }

        const { embed, actionRows, tempId } = createConfig(language, int.kami_user!);

        const msg = (await int.reply({
            embeds: [embed],
            components: actionRows
        })) as { id: string; channel_id: string; webhook_id: string };

        actionHandler.registerAction(`$a$config-toggle-sec-gen|${tempId}`, {
            action: async (comp: Interaction) => {
                comp.acknowledge();

                const updatedConfig = {
                    secret_general: !comp.kami_user!.secret_general,
                    secret_insan: comp.kami_user!.secret_insan,
                    secret_roll: comp.kami_user!.secret_roll,
                    secret_send: comp.kami_user!.secret_send,
                    secret_sheet: comp.kami_user!.secret_sheet,
                    language: comp.kami_user!.language
                };

                await UserController.updateUserConfigById(comp.kami_user!.id, {
                    secret_general: updatedConfig.secret_general
                });

                const { embed, actionRows } = createConfig(comp.language, updatedConfig, tempId);

                rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                    body: {
                        embeds: [embed],
                        components: actionRows
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            },
            singleUse: false,
            respondOnlyToUserId: int.user.id
        });

        actionHandler.registerAction(`$a$config-toggle-sec-insan|${tempId}`, {
            action: async (comp: Interaction) => {
                comp.acknowledge();

                const updatedConfig = {
                    secret_general: comp.kami_user!.secret_general,
                    secret_insan: !comp.kami_user!.secret_insan,
                    secret_roll: comp.kami_user!.secret_roll,
                    secret_send: comp.kami_user!.secret_send,
                    secret_sheet: comp.kami_user!.secret_sheet,
                    language: comp.kami_user!.language
                };

                await UserController.updateUserConfigById(comp.kami_user!.id, {
                    secret_insan: updatedConfig.secret_insan
                });

                const { embed, actionRows } = createConfig(comp.language, updatedConfig, tempId);

                rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                    body: {
                        embeds: [embed],
                        components: actionRows
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            },
            singleUse: false,
            respondOnlyToUserId: int.user.id
        });

        actionHandler.registerAction(`$a$config-toggle-sec-roll|${tempId}`, {
            action: async (comp: Interaction) => {
                comp.acknowledge();

                const updatedConfig = {
                    secret_general: comp.kami_user!.secret_general,
                    secret_insan: comp.kami_user!.secret_insan,
                    secret_roll: !comp.kami_user!.secret_roll,
                    secret_send: comp.kami_user!.secret_send,
                    secret_sheet: comp.kami_user!.secret_sheet,
                    language: comp.kami_user!.language
                };

                await UserController.updateUserConfigById(comp.kami_user!.id, {
                    secret_roll: updatedConfig.secret_roll
                });

                const { embed, actionRows } = createConfig(comp.language, updatedConfig, tempId);

                rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                    body: {
                        embeds: [embed],
                        components: actionRows
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            },
            singleUse: false,
            respondOnlyToUserId: int.user.id
        });

        actionHandler.registerAction(`$a$config-toggle-sec-send|${tempId}`, {
            action: async (comp: Interaction) => {
                comp.acknowledge();

                const updatedConfig = {
                    secret_general: comp.kami_user!.secret_general,
                    secret_insan: comp.kami_user!.secret_insan,
                    secret_roll: comp.kami_user!.secret_roll,
                    secret_send: !comp.kami_user!.secret_send,
                    secret_sheet: comp.kami_user!.secret_sheet,
                    language: comp.kami_user!.language
                };

                await UserController.updateUserConfigById(comp.kami_user!.id, {
                    secret_send: updatedConfig.secret_send
                });

                const { embed, actionRows } = createConfig(comp.language, updatedConfig, tempId);

                rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                    body: {
                        embeds: [embed],
                        components: actionRows
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            },
            singleUse: false,
            respondOnlyToUserId: int.user.id
        });

        actionHandler.registerAction(`$a$config-toggle-sec-sheet|${tempId}`, {
            action: async (comp: Interaction) => {
                comp.acknowledge();

                const updatedConfig = {
                    secret_general: comp.kami_user!.secret_general,
                    secret_insan: comp.kami_user!.secret_insan,
                    secret_roll: comp.kami_user!.secret_roll,
                    secret_send: comp.kami_user!.secret_send,
                    secret_sheet: !comp.kami_user!.secret_sheet,
                    language: comp.kami_user!.language
                };

                await UserController.updateUserConfigById(comp.kami_user!.id, {
                    secret_sheet: updatedConfig.secret_sheet
                });

                const { embed, actionRows } = createConfig(comp.language, updatedConfig, tempId);

                rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                    body: {
                        embeds: [embed],
                        components: actionRows
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            },
            singleUse: false,
            respondOnlyToUserId: int.user.id
        });

        actionHandler.registerAction(`$a$config-toggle-lang|${tempId}`, {
            action: async (comp: Interaction) => {
                comp.acknowledge();

                const updatedConfig = {
                    secret_general: comp.kami_user!.secret_general,
                    secret_insan: comp.kami_user!.secret_insan,
                    secret_roll: comp.kami_user!.secret_roll,
                    secret_send: comp.kami_user!.secret_send,
                    secret_sheet: comp.kami_user!.secret_sheet,
                    language: language
                };

                switch (`${comp.kami_user!.language}`.toLowerCase()) {
                    case 'en_us':
                        updatedConfig.language = Available_Languages.PT_BR;
                        break;
                    case 'pt_br':
                        updatedConfig.language = Available_Languages.EN_US;
                        break;
                    default:
                        updatedConfig.language = Available_Languages.EN_US;
                }

                await UserController.updateUserConfigById(comp.kami_user!.id, {
                    language: updatedConfig.language
                });

                const { embed, actionRows } = createConfig(updatedConfig.language, updatedConfig, tempId);

                rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                    body: {
                        embeds: [embed],
                        components: actionRows
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            },
            singleUse: false,
            respondOnlyToUserId: int.user.id
        });

        return;
    }
};
