import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import { Available_Languages, Command_Category } from '../../types/enums';
import SheetController from '../../controllers/sheet.controller';
import SheetServices from '../../services/sheet.services';
import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';

export default {
    ownerOnly: false,
    commandNames: {
        'pt-br': 'ficha_configurar_senha',
        'en-us': 'sheet_configure_password'
    },
    fullNames: {
        'pt-br': 'Configurar Senha da Ficha',
        'en-us': 'Configure Sheet Password'
    },
    descriptions: {
        'pt-br': 'Define ou remove a senha da sua ficha via modal.',
        'en-us': 'Set or remove sheet password via modal.'
    },
    arguments: {
        'pt-br': [
            {
                name: 'nome_da_ficha',
                description: 'Nome da ficha que deseja alterar a senha.',
                type: 'STRING',
                required: true,
                autocomplete: false
            },
            {
                name: 'nova_senha_da_ficha',
                description: 'Nova senha para a ficha.',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ],
        'en-us': [
            {
                name: 'sheet_name',
                description: 'The name of the sheet you want to change password.',
                type: 'STRING',
                required: true,
                autocomplete: false
            },
            {
                name: 'new_sheet_password',
                description: 'The new password for the sheet.',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ]
    },
    type: 1,
    category: Command_Category.SHEET_ALTER,
    doNotAcknowledge: true,
    run: async (int: Interaction, language: Available_Languages) => {
        await int.acknowledge(true);
        const sheetName = int.getArgs().get('sheet_name')?.value || int.getArgs().get('nome_da_ficha')?.value;
        const passwordValue =
            int.getArgs().get('new_sheet_password')?.value || int.getArgs().get('nova_senha_da_ficha')?.value;

        if (!sheetName || !passwordValue || (typeof passwordValue === 'string' && passwordValue.trim().length === 0)) {
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

        const hash = await SheetServices.hashPasswordValue(String(passwordValue));
        await SheetController.updatePasswordById(sheet.id, hash);

        return int.reply({
            content: localization(language, 'sheet-config|update-success-password')
        });
    }
};
