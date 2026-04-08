import UserController from '../../controllers/user.controller';
import db from '../../configs/database';
import { Available_Languages } from '../../types/enums';

async function getUserConfig(id: number | Discord_Id): Promise<User_Config> {
    let user_config: User_Config | null = null;
    let user: User | null = null;

    if (typeof id === 'number') {
        user_config = await db.users_config.findFirst({
            where: {
                user_id: id
            }
        });
    } else {
        user = await UserController.getByDiscordId(id.discord_id);

        if (user) {
            user_config = await db.users_config.findFirst({
                where: {
                    user_id: user.id
                }
            });
        }
    }

    if (!user_config) {
        user_config = {
            id: 0,
            user_id: user ? user.id : parseInt(`${id}`),
            language: Available_Languages.EN_US,
            secret_roll: false,
            secret_insan: false,
            secret_general: false,
            secret_sheet: false,
            secret_send: false
        };
    }

    return user_config;
}

export { getUserConfig };
