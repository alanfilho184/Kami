import { EmbedBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import SheetController from '../../controllers/sheet.controller';

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'listar_fichas',
        en_us: 'sheets_list'
    },
    fullNames: {
        pt_br: 'Listar Fichas',
        en_us: 'List Sheets'
    },
    descriptions: {
        pt_br: 'Lista todas as fichas criadas por você.',
        en_us: 'Lists all sheets created by you.'
    },
    type: 1,
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
