import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import SheetController from '../../controllers/sheet.controller';
import sheetNameCache from '../../resources/cache/sheet-name.cache';
import { similaritySearch } from '../../resources/utils/string-similarity';
import { randomUUID } from 'crypto';
import actionHandler from '../../resources/utils/action-handler';
import { ButtonStyle, Routes } from 'discord-api-types/v10';
import rest from '../../configs/rest';
import logger from '../../configs/logger';

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'apagar_ficha',
        en_us: 'delete_sheet'
    },
    fullNames: {
        pt_br: 'Apagar Ficha',
        en_us: 'Delete Sheet'
    },
    descriptions: {
        pt_br: 'Apaga uma ficha criada por você.',
        en_us: 'Deletes a sheet created by you.'
    },
    arguments: {
        pt_br: [
            {
                name: 'nome_da_ficha',
                description: 'Nome da ficha que deseja apagar.',
                type: 'STRING',
                required: true,
                autocomplete: true
            }
        ],
        en_us: [
            {
                name: 'sheet_name',
                description: 'The name of the sheet you want to delete.',
                type: 'STRING',
                required: true,
                autocomplete: true
            }
        ]
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        const sheetName = int.getArgs().get('sheet_name').value;

        const sheet = await SheetController.getByUserIdAndSheetName(int.kami_user!.id, sheetName);

        if (!sheet) {
            return int.reply({
                content: localization(language, 'delete-sheet|sheet-not-found', [{ replace: '$sheet$', value: sheetName }])
            });
        } else {
            const tempId = randomUUID();

            const buttonConfirm = new ButtonBuilder()
                .setCustomId(`$a$confirm-delete-sheet|${tempId}`)
                .setLabel(localization(language, 'delete-sheet|delete-sheet-button'))
                .setStyle(ButtonStyle.Success);

            const buttonCancel = new ButtonBuilder()
                .setCustomId(`$a$cancel-delete-sheet|${tempId}`)
                .setLabel(localization(language, 'delete-sheet|cancel-delete-sheet-button'))
                .setStyle(ButtonStyle.Danger);

            const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonConfirm, buttonCancel);

            const msg = (await int.reply({
                content: localization(language, 'delete-sheet|confirm-delete-sheet-message', [
                    {
                        replace: '$sheet$',
                        value: sheetName
                    }
                ]),
                components: [actionRow]
            })) as { id: string; channel_id: string; webhook_id: string };

            actionHandler.registerAction(`$a$confirm-delete-sheet|${tempId}`, {
                action: async (comp: Interaction) => {
                    comp.acknowledge();

                    SheetController.deleteById(sheet.id)
                        .then(() => {
                            sheetNameCache.remove(int.kami_user!.id, sheetName);

                            rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                                body: {
                                    content: localization(language, 'delete-sheet|sheet-deleted'),
                                    components: []
                                },
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).catch(err => {
                                logger.logText('ERROR', `Error updating cancel new sheet message: ${err}`);
                            });
                        })
                        .catch(err => {
                            logger.logText('ERROR', `Error deleting sheet: ${err}`);
                        });
                },
                singleUse: true
            });

            actionHandler.registerAction(`$a$cancel-delete-sheet|${tempId}`, {
                action: (comp: Interaction) => {
                    comp.acknowledge();

                    rest.patch(Routes.webhookMessage(int.application_id, comp.token, msg.id), {
                        body: {
                            content: localization(language, 'delete-sheet|cancel-delete-sheet'),
                            components: [
                                {
                                    type: 1,
                                    components: [
                                        buttonConfirm.setDisabled().toJSON(),
                                        buttonCancel.setDisabled().toJSON()
                                    ]
                                }
                            ]
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).catch(err => {
                        logger.logText('ERROR', `Error updating cancel new sheet message: ${err}`);
                    });
                },
                singleUse: true
            });

            return;
        }
    },
    autocomplete(int: Interaction, language: Available_Languages) {
        const sheets = sheetNameCache.get(int.kami_user?.id!);

        if (sheets) {
            let sheetNames: Set<string> = new Set();
            let sheetsNamesArray: { name: string; value: string }[] = [];

            if (int.kami_user?.default_sheet) {
                sheetNames.add(`${int.kami_user.default_sheet}`);
            }

            let search = similaritySearch(int.getArgs().get('sheet_name').value, sheets);

            for (let s = 0; s < 6; s++) {
                if (sheetNames.size <= 6 && search.allMatches[s]) {
                    sheetNames.add(search.allMatches[s].value);
                }
            }

            for (let sheet of sheetNames) {
                sheetsNamesArray.push({
                    name: sheet,
                    value: sheet
                });
            }

            int.autocomplete(sheetsNamesArray);
        } else {
            int.autocomplete([]);
        }
    }
};
