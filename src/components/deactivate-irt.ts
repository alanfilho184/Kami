import { Interaction } from '../resources/utils/interaction-handler';
import SheetController from '../controllers/sheet.controller';
import rest from '../configs/rest';
import { Routes } from 'discord-api-types/v10';
import { localization } from '../resources/localization';
import { Command_Category } from '../types/enums';

export default {
    name: 'deactivate-irt',
    ownerOnly: false,
    type: 'bot',
    category: Command_Category.SHEET_ALTER,
    run: async (int: Interaction, language: Available_Languages) => {
        const irtSheet = await SheetController.getIrtSheetByMsgId(int.component!.args);

        if (irtSheet === null || irtSheet.user_id !== int.kami_user!.id) {
            return;
        } else {
            await SheetController.deleteIrtSheetByMsgId(int.component!.args);

            await rest.patch(Routes.channelMessage(`${irtSheet?.channel_id}`, `${irtSheet?.msg_id}`), {
                body: {
                    components: []
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await int.reply({
                content: localization(language, 'sheet-send|irt-deactivated')
            });
        }
    }
};
