import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import { Available_Languages, Command_Category } from '../../types/enums';
import SheetController from '../../controllers/sheet.controller';
import { InteractionResponseFlags } from 'discord-interactions';

export default {
    ownerOnly: false,
    commandNames: {
        'pt-br': 'ficha_configurar_acesso',
        'en-us': 'sheet_configure_access'
    },
    fullNames: {
        'pt-br': 'Configurar Acesso da Ficha',
        'en-us': 'Configure Sheet Access'
    },
    descriptions: {
        'pt-br': 'Configura a visibilidade (pública/privada) da sua ficha.',
        'en-us': 'Configure sheet visibility (public/private).'
    },
    arguments: {
        'pt-br': [
            {
                name: 'nome_da_ficha',
                description: 'Nome da ficha que deseja configurar.',
                type: 'STRING',
                required: true,
                autocomplete: false
            },
            {
                name: 'visibilidade',
                description: 'Defina se a ficha será pública ou privada.',
                type: 'STRING',
                required: true,
                choices: [
                    { name: 'Pública', return: 'public' },
                    { name: 'Privada', return: 'private' }
                ]
            }
        ],
        'en-us': [
            {
                name: 'sheet_name',
                description: 'The name of the sheet you want to configure.',
                type: 'STRING',
                required: true,
                autocomplete: false
            },
            {
                name: 'visibility',
                description: 'Set sheet as public or private.',
                type: 'STRING',
                required: true,
                choices: [
                    { name: 'Public', return: 'public' },
                    { name: 'Private', return: 'private' }
                ]
            }
        ]
    },
    type: 1,
    category: Command_Category.SHEET_ALTER,
    doNotAcknowledge: true,
    run: async (int: Interaction, language: Available_Languages) => {
        int.acknowledge(true);
        const sheetName = int.getArgs().get('sheet_name')?.value || int.getArgs().get('nome_da_ficha')?.value;
        const visibility = int.getArgs().get('visibility')?.value || int.getArgs().get('visibilidade')?.value;

        if (!sheetName || !visibility) {
            return int.reply({
                content: localization(language, 'sheet-view|invalid-args')
            });
        }

        const sheet = await SheetController.getByUserIdAndSheetName(int.kami_user?.id!, sheetName);

        if (!sheet) {
            return int.reply({
                content: localization(language, 'sheet|sheet-not-found', [{ replace: '$sheet$', value: sheetName }])
            });
        }

        const isPublic = visibility === 'public';

        await SheetController.updatePrivacyById(sheet.id, isPublic);

        return int.reply({
            content: localization(
                language,
                isPublic ? 'sheet-config|update-success-public' : 'sheet-config|update-success-private'
            )
        });
    }
};
