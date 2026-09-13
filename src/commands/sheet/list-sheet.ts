import { EmbedBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import SheetController from '../../controllers/sheet.controller';
import { Command_Category } from '../../types/enums';

export default {
    ownerOnly: false,
    commandNames: {
        'pt-br': 'listar_fichas',
        'en-us': 'sheets_list'
    },
    fullNames: {
        'pt-br': 'Listar Fichas',
        'en-us': 'List Sheets'
    },
    descriptions: {
        'pt-br': 'Lista todas as fichas criadas por você.',
        'en-us': 'Lists all sheets created by you.'
    },
    type: 1,
    category: Command_Category.SHEET_SEND,
    run: async (int: Interaction, language: Available_Languages) => {
        const sheets = await SheetController.getAllSheetsNameByUserId(int.kami_user!.id);

        if (sheets.length === 0) {
            return int.reply({ content: localization(language, 'list-sheets|no-sheets-found') });
        }

        const embed = new EmbedBuilder()
            .setTitle(
                localization(
                    language,
                    sheets.length > 1 ? 'list-sheets|multiple-list-title' : 'list-sheets|single-list-title',
                    [{ replace: '$quantity$', value: `${sheets.length}` }]
                )
            )
            .setColor(parseInt(config.EMBED_COLOR));

        let description = '';

        for (const sheet of sheets) {
            description += `**• ${sheet}**\n`;
        }

        embed.setDescription(description);

        return int.reply({ embeds: [embed] });
    }
};
