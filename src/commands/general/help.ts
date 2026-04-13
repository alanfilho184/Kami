import {
    EmbedBuilder,
    ButtonBuilder,
    SelectMenuBuilder,
    SelectMenuOptionBuilder,
    ActionRowBuilder
} from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { ButtonStyle, Routes } from 'discord-api-types/v10';
import { randomUUID } from 'node:crypto';
import commands from '../../commands';
import actionHandler from '../../resources/utils/action-handler';
import rest from '../../configs/rest';
import logger from '../../configs/logger';
import { Command_Category } from '../../types/enums';

export default {
    ownerOnly: false,
    commandNames: {
        'pt-br': 'ajuda',
        'en-us': 'help'
    },
    fullNames: {
        'pt-br': 'Ajuda',
        'en-us': 'Help'
    },
    descriptions: {
        'pt-br': 'Mostra uma lista detalhada de todos os comandos do bot e como usá-los.',
        'en-us': 'Shows a detailed list of all bot commands and how to use them.'
    },
    type: 1,
    category: Command_Category.GENERAL,
    run: async (int: Interaction, language: Available_Languages) => {
        const embed = new EmbedBuilder()
            .setTitle('Ajuda Kami')
            .setDescription(localization(language, 'help|description'))
            .setColor(parseInt(config.EMBED_COLOR))
            .setTimestamp(Date.now())
            .setFooter({
                text: localization(language, 'embed|footer', [
                    { replace: '$version$', value: config.VERSION },
                    { replace: '$year$', value: new Date().getFullYear().toString() }
                ])
            });

        const tempId = randomUUID();

        const selectMenu = new SelectMenuBuilder()
            .setCustomId(`$a$help-select-menu|${tempId}`)
            .setPlaceholder('Selecione um comando');

        for (let command of commands.values()) {
            if (!command.ownerOnly) {
                selectMenu.addOptions(
                    new SelectMenuOptionBuilder()
                        .setLabel(command.fullNames[language])
                        .setValue(command.commandNames['en-us'])
                        .setDescription(command.descriptions[language])
                );
            } else {
                continue;
            }
        }

        const websiteButton = new ButtonBuilder()
            .setLabel(localization(language, 'links|website-button'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://kamiapp.com.br');

        const supportButton = new ButtonBuilder()
            .setLabel(localization(language, 'links|support-button'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://kamiapp.com.br/suporte');

        const actionRow = new ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>().addComponents(
            websiteButton,
            supportButton
        );
        const actionRow2 = new ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>().addComponents(selectMenu);

        const msg = (await int.reply({
            embeds: [embed],
            components: [actionRow, actionRow2]
        })) as { id: string; channel_id: string; webhook_id: string };

        actionHandler.registerAction(`$a$help-select-menu|${tempId}`, {
            action: async (comp: Interaction) => {
                comp.acknowledge();
                const helpCommand = comp.data.values![0];

                const helpEmbed = new EmbedBuilder()
                    .setAuthor({ name: 'Ajuda - Kami BOT' })
                    .setTitle(localization(language, `help|${helpCommand}-title`))
                    .setDescription(localization(language, `help|${helpCommand}-description`))
                    .setColor(parseInt(config.EMBED_COLOR))
                    .setTimestamp(Date.now())
                    .setFooter({
                        text: localization(language, 'embed|footer', [
                            { replace: '$version$', value: config.VERSION },
                            { replace: '$year$', value: new Date().getFullYear().toString() }
                        ])
                    });

                rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                    body: {
                        embeds: [helpEmbed],
                        components: [actionRow, actionRow2]
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch(err => {
                    logger.logText('ERROR', `Error updating cancel new sheet message: ${err}`);
                });
            },
            singleUse: false,
            respondOnlyToUserId: int.user.id
        });
    }
};
