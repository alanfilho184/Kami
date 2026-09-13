import { createSheetEmbed } from '../../commands/sheet/sheet-send';
import SheetController from '../../controllers/sheet.controller';
import rest from '../../configs/rest';
import { Routes } from 'discord-api-types/rest/v10';
import UserController from '../../controllers/user.controller';
import logger from '../../configs/logger';

export default async function syncSheet(data: {
    sheet: Sheet;
    language?: Available_Languages;
    user?: User & User_Config;
}) {
    let language: Available_Languages | null = null;
    let user: (User & User_Config) | null = null;

    if (data.language) {
        language = data.language as Available_Languages;
    }

    if (data.user) {
        user = data.user;
    } else {
        const userDb = await UserController.getById(data.sheet.user_id);

        if (userDb) {
            user = userDb;
        } else {
            logger.logText(
                'WARN',
                `User with ID ${data.sheet.user_id} not found in database while syncing sheet with ID ${data.sheet.id}.`
            );
            return;
        }
    }

    if (language == null) {
        language = user.language as Available_Languages;
    }

    SheetController.getIrtSheetBySheetId(data.sheet.id).then(async irtSheets => {
        if (irtSheets && irtSheets?.length > 0) {
            const embeds = createSheetEmbed({ ...data.sheet, user: user }, language);

            for (let irtSheet of irtSheets) {
                await rest
                    .patch(Routes.channelMessage(`${irtSheet.channel_id}`, `${irtSheet.msg_id}`), {
                        body: {
                            embeds: embeds
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .catch(err => {
                        logger.logText('ERROR', `Error updating IRT sheet message: ${err}`);
                    });

                await new Promise(r => setTimeout(r, 3000));
            }
        }
    });
}
