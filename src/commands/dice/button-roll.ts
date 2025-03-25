import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { validateDiceString } from '../../resources/utils/dice-roller';
import { localization } from '../../resources/localization';
import { ButtonStyleTypes } from 'discord-interactions';
import { ButtonStyle } from 'discord-api-types/v10';
import config from '../../configs/config';

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'buttonroll',
        en_us: 'buttonroll'
    },
    fullNames: {
        pt_br: 'Button Roll',
        en_us: 'Button Roll'
    },
    descriptions: {
        pt_br: 'Cria uma mensagem com botões para rolar dados.',
        en_us: 'Create a message with custom buttons to roll dices.'
    },
    arguments: {
        pt_br: [
            {
                name: 'dados',
                description:
                    'Dados que devem ser criados botões, no máximo 25, separados por "|" (ex: 2d8+2 | 1d20 | 3d6).',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ],
        en_us: [
            {
                name: 'dices',
                description:
                    'Dices that should be created buttons, up to 25, separated by "|" (ex: 2d8+2 | 1d20 | 3d6).',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ]
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        const dices = int
            .getArgs()
            .get('dices')
            .value.split('|')
            .map((dado: string) => dado.replace(/\s/g, ''));

        if (dices.length > 25) {
            return int.reply({ content: localization(language, 'button-roll|too-many-dices') });
        }

        let invalidDices: string[] = [];
        for (let dice of dices) {
            if (!validateDiceString(dice)) {
                invalidDices.push(dice);
            }
        }

        if (invalidDices.length > 0) {
            return int.reply({
                content: localization(language, 'button-roll|invalid-dices', [
                    {
                        replace: '$invalid-dices$',
                        value: invalidDices.join(', ')
                    }
                ])
            });
        }

        let actionRowsCount = Math.ceil(dices.length / 5);
        let actionRows: any[] = [];

        for (let i = 0; i < actionRowsCount; i++) {
            let buttons: any[] = [];

            for (let j = 0; j < 5; j++) {
                let index = i * 5 + j;
                if (index >= dices.length) break;

                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(`buttonRoll|${dices[index]}`)
                        .setLabel(dices[index])
                        .setStyle(ButtonStyle.Primary)
                );
            }

            actionRows.push(new ActionRowBuilder().addComponents(buttons));
        }

        const buttonRollEmbed = new EmbedBuilder()
            .setTitle(localization(language, 'button-roll|title'))
            .setDescription(localization(language, 'button-roll|description'))
            .setColor(parseInt(config.EMBED_COLOR))
            .setFooter({
                text: localization(language, 'embed|footer', [
                    { replace: '$version$', value: config.VERSION },
                    { replace: '$year$', value: new Date().getFullYear().toString() }
                ])
            })
            .setTimestamp();

        return await int.reply({
            embeds: [buttonRollEmbed],
            components: actionRows
        });
    }
};
