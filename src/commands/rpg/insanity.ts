import { EmbedBuilder } from '@discordjs/builders';
import db from '../../configs/database';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { diceRoller } from '../../resources/utils/dice-roller';

function deDuplicateRolls(rolls: number[], diceSize: number): number[] {
    const uniqueRolls = new Set<number>();

    rolls.forEach(roll => {
        uniqueRolls.add(roll);
    });

    while (uniqueRolls.size != rolls.length) {
        uniqueRolls.add(diceRoller(`1d${diceSize}`).results[0]);
    }

    return Array.from(uniqueRolls);
}

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'insanidade',
        en_us: 'insanity'
    },
    fullNames: {
        pt_br: 'Insanidade',
        en_us: 'Insanity'
    },
    descriptions: {
        pt_br: 'Envia uma insanidade para um personagem, temporaria ou permanente.',
        en_us: 'Sends an insanity to a character, temporary or permanent.'
    },
    arguments: {
        pt_br: [
            {
                name: 'tipo',
                description: 'O tipo de insanidade (temporaria ou permanente).',
                type: 'STRING',
                required: true,
                choices: [
                    {
                        name: 'Temporaria',
                        return: 'temporary'
                    },
                    {
                        name: 'Permanente',
                        return: 'permanent'
                    }
                ]
            }
        ],
        en_us: [
            {
                name: 'type',
                description: 'The type of insanity (temporary or permanent).',
                type: 'STRING',
                required: true,
                choices: [
                    {
                        name: 'Temporary',
                        return: 'temporary'
                    },
                    {
                        name: 'Permanent',
                        return: 'permanent'
                    }
                ]
            }
        ]
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        const type = int.getArgs().get('type').value;

        const insanityEmbed = new EmbedBuilder()
            .setColor(parseInt(config.EMBED_COLOR))
            .setTimestamp()
            .setFooter({
                text: localization(language, 'embed|footer', [
                    { replace: '$version$', value: config.VERSION },
                    { replace: '$year$', value: new Date().getFullYear().toString() }
                ])
            });
        if (type === 'temporary') {
            insanityEmbed.setTitle(localization(language, 'insanity|temporary-title'));

            const temporaryInsanities = (
                await db.resources.findUnique({
                    where: {
                        name: 'temporary_insanity'
                    },
                    select: {
                        data: true
                    }
                })
            )?.data! as string[];

            const roll = diceRoller(`1d${temporaryInsanities.length}`);

            const insanitys: string[] = [];
            if (roll.results[0] == 1) {
                let positionRoll = diceRoller(`3d${temporaryInsanities.length}`);

                positionRoll = deDuplicateRolls(positionRoll.results, temporaryInsanities.length);

                for (let i = 1; i < 4; i++) {
                    insanitys.push(temporaryInsanities[positionRoll.results[i] - 1]);
                }

                insanityEmbed.setDescription(
                    localization(language, 'insanity|temporary-description', [
                        { replace: '$insanity$', value: insanitys[0] },
                        { replace: '$insanity2$', value: insanitys[1] },
                        { replace: '$insanity3$', value: insanitys[2] }
                    ])
                );
            } else if (roll.results[0] == 2) {
                let positionRoll = diceRoller(`2d${temporaryInsanities.length}`);

                positionRoll = deDuplicateRolls(positionRoll.results, temporaryInsanities.length);

                for (let i = 1; i < 3; i++) {
                    insanitys.push(temporaryInsanities[roll.results[i] - 1]);
                }

                insanityEmbed.setDescription(
                    localization(language, 'insanity|temporary-description', [
                        { replace: '$insanity$', value: insanitys[0] },
                        { replace: '$insanity2$', value: insanitys[1] }
                    ])
                );
            } else {
                insanityEmbed.setDescription(
                    localization(language, 'insanity|temporary-description', [
                        { replace: '$insanity$', value: temporaryInsanities[roll.results[0] - 1] }
                    ])
                );
            }
        } else if (type === 'permanent') {
            insanityEmbed.setTitle(localization(language, 'insanity|permanent-title'));

            const permanentInsanities = (
                await db.resources.findUnique({
                    where: {
                        name: 'permanent_insanity'
                    },
                    select: {
                        data: true
                    }
                })
            )?.data! as string[];

            const roll = diceRoller(`1d${permanentInsanities.length}`);

            insanityEmbed.setDescription(
                localization(language, 'insanity|permanent-description', [
                    { replace: '$insanity$', value: permanentInsanities[roll.results[0] - 1] }
                ])
            );
        }

        return int.reply({
            embeds: [insanityEmbed]
        });
    }
};
