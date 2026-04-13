import { Router, Request, Response } from 'express';
import {
    InteractionResponseType,
    InteractionType,
    InteractionResponseFlags,
    MessageComponentTypes
} from 'discord-interactions';
import { Interaction } from '../resources/utils/interaction-handler';
import commands from '../commands';
import components from '../components';
import logger from '../configs/logger';
import commandsStatistics from '../resources/utils/command-statistics';
import { localization } from '../resources/localization';
import { Available_Languages, Command_Category } from '../types/enums';
import actionHandler from '../resources/utils/action-handler';

const router = Router();

router.post('/interactions', async (req: Request, res: Response) => {
    let int: Interaction;
    try {
        int = new Interaction(req.body, res);
    } catch (err) {
        //@ts-ignore
        if ((err.message = 'Unknown user')) {
            return;
        } else {
            return logger.logText('ERROR', err);
        }
    }

    if (int.user.system === true || int.user.bot === true) {
        return res.end();
    }

    await int.loadUser();

    if (int.type === InteractionType.PING) {
        res.json({
            type: InteractionResponseType.PONG
        });
    } else if (int.type === InteractionType.APPLICATION_COMMAND) {
        logger.logDiscord(int);
        const command = commands.get(int.data.name);

        if (!command) {
            await int.acknowledge(true);
            return await int.reply({
                content: localization(int.language, 'cmd-interaction|command-not-found'),
                flags: InteractionResponseFlags.EPHEMERAL
            });
        } else {
            commandsStatistics.sumCommand(command.commandNames[Available_Languages['en-us']]);

            if (command.ownerOnly && int.user.id !== process.env.OWNER_ID) {
                await int.acknowledge(true);
                return await int.reply({
                    content: localization(int.language, 'cmd-interaction|owner-only'),
                    flags: InteractionResponseFlags.EPHEMERAL
                });
            } else {
                if (!command.doNotAcknowledge) {
                    switch (command.category) {
                        case Command_Category.GENERAL:
                            await int.acknowledge(int.kami_user?.secret_general);
                            break;
                        case Command_Category.INSANITY:
                            await int.acknowledge(int.kami_user?.secret_insan);
                            break;
                        case Command_Category.ROLL:
                            await int.acknowledge(int.kami_user?.secret_roll);
                            break;
                        case Command_Category.SHEET_ALTER:
                            await int.acknowledge(int.kami_user?.secret_sheet);
                            break;
                        case Command_Category.SHEET_SEND:
                            await int.acknowledge(int.kami_user?.secret_sheet);
                            break;
                        default:
                            await int.acknowledge();
                            break;
                    }
                }

                try {
                    await command.run(int, int.language);
                } catch (err) {
                    logger.logText('ERROR', err);
                    await int.reply({
                        content: localization(int.language, 'cmd-interaction|command-error'),
                        flags: InteractionResponseFlags.EPHEMERAL
                    });
                }
            }
        }
    } else if (int.type === InteractionType.MESSAGE_COMPONENT) {
        if (int.data.custom_id!.startsWith('$a$')) {
            return actionHandler.executeAction(int.data.custom_id!, int.user.id, int);
        } else {
            logger.logDiscord(int);
            const component = components.get(int.component!.name);

            if (!component) {
                await int.acknowledge(true);
                return await int.reply({
                    content: localization(int.language, 'cmd-interaction|command-not-found'),
                    flags: InteractionResponseFlags.EPHEMERAL
                });
            } else {
                if (int.component!.type === MessageComponentTypes.BUTTON) {
                    commandsStatistics.sumComponent(component.name);
                }

                if (component.ownerOnly && int.user.id !== process.env.OWNER_ID) {
                    await int.acknowledge(true);
                    return await int.reply({
                        content: localization(int.language, 'cmd-interaction|owner-only'),
                        flags: InteractionResponseFlags.EPHEMERAL
                    });
                } else {
                    if (!component.doNotAcknowledge) {
                        switch (component.category) {
                            case Command_Category.GENERAL:
                                await int.acknowledge(int.kami_user?.secret_general);
                                break;
                            case Command_Category.INSANITY:
                                await int.acknowledge(int.kami_user?.secret_insan);
                                break;
                            case Command_Category.ROLL:
                                await int.acknowledge(int.kami_user?.secret_roll);
                                break;
                            case Command_Category.SHEET_ALTER:
                                await int.acknowledge(int.kami_user?.secret_sheet);
                                break;
                            case Command_Category.SHEET_SEND:
                                await int.acknowledge(int.kami_user?.secret_sheet);
                                break;
                            default:
                                await int.acknowledge();
                                break;
                        }
                    }

                    try {
                        await component.run(int, int.language);
                    } catch (err) {
                        logger.logText('ERROR', err);
                        await int.reply({
                            content: localization(int.language, 'cmd-interaction|command-error'),
                            flags: InteractionResponseFlags.EPHEMERAL
                        });
                    }
                }
            }
        }
    } else if (int.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
        const command = commands.get(int.data.name);

        if (!command) {
            return logger.logText('ERROR', `Command "${int.data.name}" not found in autocomplete interaction`);
        } else {
            if (command.autocomplete) {
                await command.autocomplete(int, int.language);
            } else {
                return logger.logText(
                    'ERROR',
                    `Command "${command.commandNames[Available_Languages['en-us']]}" does not have an autocomplete method`
                );
            }
        }
    }
});

export default router;
