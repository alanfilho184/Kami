import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import db from '../../configs/database';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { ButtonStyle } from 'discord-api-types/v10';
import { Attribute_Type } from '../../types/enums';
import sheetNameCache from '../../resources/cache/sheet-name.cache';
import stringSimilarity, { similaritySearch } from '../../resources/utils/string-similarity';
import SheetController from '../../controllers/sheet.controller';
import SheetServices from '../../services/sheet.services';
import { inspect } from 'util';

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'ficha',
        en_us: 'sheet'
    },
    fullNames: {
        pt_br: 'Ficha',
        en_us: 'Sheet'
    },
    descriptions: {
        pt_br: 'Cria/edita uma ficha.',
        en_us: 'Create/edit a sheet.'
    },
    arguments: {
        pt_br: [
            {
                name: 'nome_da_ficha',
                description: 'Nome da ficha que deseja criar/editar.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'tipo_de_componente',
                description: 'O tipo de componente do atributo (tem maior efeito na ficha do site).',
                type: 'STRING',
                required: true,
                choices: [
                    {
                        name: 'Texto',
                        return: Attribute_Type.TEXT
                    },
                    {
                        name: 'Número',
                        return: Attribute_Type.NUMBER
                    },
                    {
                        name: 'Imagem',
                        return: Attribute_Type.IMAGE
                    },
                    {
                        name: 'Lista',
                        return: Attribute_Type.LIST
                    },
                    {
                        name: 'Barra de progresso',
                        return: Attribute_Type.BAR
                    }
                ]
            },
            {
                name: 'secao',
                description: 'Nome da seção que deseja adicionar/editar na sua ficha.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'atributo',
                description: 'Atributo que deseja adicionar/editar na sua ficha.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'valor',
                description: 'Valor que o atributo terá. O formato do valor depende do tipo de componente.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'posicao',
                description: 'A posição do atributo na ficha (seção|numero_posicao). Ex: Poderes|3',
                type: 'STRING',
                required: false,
                autocomplete: true
            }
        ],
        en_us: [
            {
                name: 'sheet_name',
                description: 'Sheet name you want to create/edit.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'component_type',
                description: 'The attribute component type (has a greater effect on the web version).',
                type: 'STRING',
                required: true,
                choices: [
                    {
                        name: 'Text',
                        return: Attribute_Type.TEXT
                    },
                    {
                        name: 'Number',
                        return: Attribute_Type.NUMBER
                    },
                    {
                        name: 'Image',
                        return: Attribute_Type.IMAGE
                    },
                    {
                        name: 'List',
                        return: Attribute_Type.LIST
                    },
                    {
                        name: 'Progress bar',
                        return: Attribute_Type.BAR
                    }
                ]
            },
            {
                name: 'section',
                description: 'Name of the section you want to add/edit in your sheet.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'attribute',
                description: 'Attribute you want to add/edit in your sheet.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'value',
                description: 'Value that the attribute will have. The value format depends on the component type.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'position',
                description: 'The attribute position in the sheet (section|position_number). Ex: Powers|3',
                type: 'STRING',
                required: false,
                autocomplete: true
            }
        ]
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        const sheetName = int.getArgs().get('sheet_name').value;
        const componentType = int.getArgs().get('component_type').value;
        const section = int.getArgs().get('section').value;
        const attribute = int.getArgs().get('attribute').value;
        const value = int.getArgs().get('value').value;
        const position = int.getArgs().get('position')?.value;

        console.log(int.getArgs());

        const sheet = await SheetController.getByUserIdAndSheetName(int.kami_user?.id!, sheetName);

        if (!sheet) {
            // TODO: Create sheet
            return int.reply({
                content: 'Ficha não encontrada.'
            });
        }

        if (sheet.user_id !== int.kami_user?.id) {
            return int.reply({
                content: 'Você não é o dono dessa ficha.'
            });
        }

        let validatedSheet = await SheetServices.validateModification(
            sheet,
            componentType,
            section,
            attribute,
            value,
            position
        );

        // console.log(validatedSheet);
        if (validatedSheet instanceof Array) {
            return int.reply({
                content: inspect(validatedSheet, { depth: 10 })
            });
        } else {
            // console.log(inspect(validatedSheet.attributes, { depth: 10 }));
        }

        return int.reply({
            content: 'Em desenvolvimento...'
        });
    },
    async autocomplete(int: Interaction, language: Available_Languages) {
        let focused = int.data.options!.filter(arg => {
            if (arg.focused === true) {
                return arg;
            }
        })[0];

        if (focused.name === 'sheet_name') {
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
        } else if (focused.name === 'section') {
            if (int.getArgs().get('sheet_name')) {
                const sheet = await SheetController.getByUserIdAndSheetName(
                    int.kami_user?.id!,
                    int.getArgs().get('sheet_name').value
                );

                if (!sheet) {
                    return int.autocomplete([]);
                } else {
                    let sections: Set<string> = new Set();
                    let sectionsArray: { name: string; value: string }[] = [];

                    for (let section of sheet.attributes.sections) {
                        sections.add(section.name);
                    }

                    let search = similaritySearch(int.getArgs().get('section').value, Array.from(sections));

                    for (let s = 0; s < 6; s++) {
                        if (sectionsArray.length <= 6 && search.allMatches[s]) {
                            sectionsArray.push({
                                name: search.allMatches[s].value,
                                value: search.allMatches[s].value
                            });
                        }
                    }

                    int.autocomplete(sectionsArray);
                }
            } else {
                int.autocomplete([]);
            }
        } else if (focused.name === 'attribute') {
            if (int.getArgs().get('sheet_name')) {
                const sheet = await SheetController.getByUserIdAndSheetName(
                    int.kami_user?.id!,
                    int.getArgs().get('sheet_name').value
                );

                if (!sheet) {
                    return int.autocomplete([]);
                } else {
                    let attributes: Set<string> = new Set();
                    let attributesArray: { name: string; value: string }[] = [];
                    let section = sheet.attributes.sections.find(s => s.name === int.getArgs().get('section').value);

                    if (!section) {
                        return int.autocomplete([]);
                    } else {
                        for (let attribute of section.attributes) {
                            attributes.add(attribute.name);
                        }

                        let search = similaritySearch(int.getArgs().get('attribute').value, Array.from(attributes));

                        for (let s = 0; s < 6; s++) {
                            if (attributesArray.length <= 6 && search.allMatches[s]) {
                                attributesArray.push({
                                    name: search.allMatches[s].value,
                                    value: search.allMatches[s].value
                                });
                            }
                        }

                        int.autocomplete(attributesArray);
                    }
                }
            } else {
                int.autocomplete([]);
            }
        } else if (focused.name === 'value') {
            if (int.getArgs().get('sheet_name')) {
                const sheet = await SheetController.getByUserIdAndSheetName(
                    int.kami_user?.id!,
                    int.getArgs().get('sheet_name').value
                );

                if (!sheet) {
                    if (int.getArgs().get('component_type').value == Attribute_Type.LIST) {
                        let value = int.getArgs().get('value').value;

                        if (value.trim() == '') {
                            return int.autocomplete([
                                {
                                    name: 'add: 1 | item de exemplo (adicione um item)',
                                    value: 'add: 1 | item de exemplo'
                                }
                            ]);
                        } else {
                            let action = similaritySearch(value.split(' ')[0], ['add', 'del', 'mod']).bestMatch.value;

                            if (action == 'add') {
                                let quantity = '';
                                try {
                                    quantity = value.split(':')[1].split('|')[0].trim();
                                } catch (err) {
                                    quantity = '';
                                }

                                let item = '';
                                try {
                                    item = value.split('|')[1].trim();
                                } catch (err) {
                                    item = '';
                                }

                                if ((quantity == '' || isNaN(Number(quantity))) && item.trim() == '') {
                                    return int.autocomplete([
                                        {
                                            name: 'Exemplo: add: 0 | Seu item aqui',
                                            value: 'add: 0 | Seu item aqui'
                                        }
                                    ]);
                                } else if (!isNaN(Number(quantity)) && item.trim() == '') {
                                    return int.autocomplete([
                                        {
                                            name: `add: ${Number(quantity)} | Seu item aqui`,
                                            value: `add: ${Number(quantity)} |`
                                        }
                                    ]);
                                } else if (!isNaN(Number(quantity)) && item.trim() != '') {
                                    return int.autocomplete([
                                        {
                                            name: `add: ${Number(quantity)} | ${item}`,
                                            value: `add: ${Number(quantity)} | ${item}`
                                        }
                                    ]);
                                } else {
                                    return int.autocomplete([]);
                                }
                            } else if (action == 'del') {
                                //@TODO: Localização
                                return int.autocomplete([
                                    {
                                        name: 'Atributo não encontrado.',
                                        value: ''
                                    }
                                ]);
                            } else if (action == 'mod') {
                                return int.autocomplete([
                                    {
                                        name: 'Atributo não encontrado.',
                                        value: ''
                                    }
                                ]);
                            }
                        }
                    }
                } else {
                    let focusedAttribute = sheet.attributes.sections
                        .find(s => s.name === int.getArgs().get('section').value)
                        ?.attributes.find(a => a.name === int.getArgs().get('attribute').value);

                    if (!focusedAttribute) {
                        if (int.getArgs().get('component_type').value == Attribute_Type.LIST) {
                            let value = int.getArgs().get('value').value;

                            if (value.trim() == '') {
                                return int.autocomplete([
                                    {
                                        name: 'add: 1 | item de exemplo (adicione um item)',
                                        value: 'add: 1 | item de exemplo'
                                    }
                                ]);
                            } else {
                                let action = similaritySearch(value.split(' ')[0], ['add', 'del', 'mod']).bestMatch
                                    .value;

                                if (action == 'add') {
                                    let quantity = '';
                                    try {
                                        quantity = value.split(':')[1].split('|')[0].trim();
                                    } catch (err) {
                                        quantity = '';
                                    }

                                    let item = '';
                                    try {
                                        item = value.split('|')[1].trim();
                                    } catch (err) {
                                        item = '';
                                    }

                                    if ((quantity == '' || isNaN(Number(quantity))) && item.trim() == '') {
                                        return int.autocomplete([
                                            {
                                                name: 'Exemplo: add: 0 | Seu item aqui',
                                                value: 'add: 0 | Seu item aqui'
                                            }
                                        ]);
                                    } else if (!isNaN(Number(quantity)) && item.trim() == '') {
                                        return int.autocomplete([
                                            {
                                                name: `add: ${Number(quantity)} | Seu item aqui`,
                                                value: `add: ${Number(quantity)} |`
                                            }
                                        ]);
                                    } else if (!isNaN(Number(quantity)) && item.trim() != '') {
                                        return int.autocomplete([
                                            {
                                                name: `add: ${Number(quantity)} | ${item}`,
                                                value: `add: ${Number(quantity)} | ${item}`
                                            }
                                        ]);
                                    } else {
                                        return int.autocomplete([]);
                                    }
                                } else if (action == 'del') {
                                    //@TODO: Localização
                                    return int.autocomplete([
                                        {
                                            name: 'Atributo não encontrado.',
                                            value: ''
                                        }
                                    ]);
                                } else if (action == 'mod') {
                                    return int.autocomplete([
                                        {
                                            name: 'Atributo não encontrado.',
                                            value: ''
                                        }
                                    ]);
                                }
                            }
                        }
                    } else {
                        if (focusedAttribute.type == Attribute_Type.LIST) {
                            let value = int.getArgs().get('value').value;

                            if (value.trim() == '') {
                                return int.autocomplete([
                                    {
                                        name: 'add: 1 | item de exemplo (adicione um item)',
                                        value: 'add: 1 | item de exemplo'
                                    },
                                    {
                                        name: 'del: item de exemplo (remova um item)',
                                        value: 'del: item de exemplo'
                                    },
                                    {
                                        name: 'mod item 1: 2 | item de exemplo (edite um item)',
                                        value: 'mod item 1: 2 | item de exemplo'
                                    }
                                ]);
                            } else {
                                let action = similaritySearch(value.split(' ')[0], ['add', 'del', 'mod']).bestMatch
                                    .value;

                                if (action == 'add') {
                                    let quantity = '';
                                    try {
                                        quantity = value.split(':')[1].split('|')[0].trim();
                                    } catch (err) {
                                        quantity = '';
                                    }

                                    let item = '';
                                    try {
                                        item = value.split('|')[1].trim();
                                    } catch (err) {
                                        item = '';
                                    }

                                    if ((quantity == '' || isNaN(Number(quantity))) && item.trim() == '') {
                                        return int.autocomplete([
                                            {
                                                name: 'Exemplo: add: 0 | Seu item aqui',
                                                value: 'add: 0 | Seu item aqui'
                                            }
                                        ]);
                                    } else if (!isNaN(Number(quantity)) && item.trim() == '') {
                                        return int.autocomplete([
                                            {
                                                name: `add: ${Number(quantity)} | Seu item aqui`,
                                                value: `add: ${Number(quantity)} |`
                                            }
                                        ]);
                                    } else if (!isNaN(Number(quantity)) && item.trim() != '') {
                                        return int.autocomplete([
                                            {
                                                name: `add: ${Number(quantity)} | ${item}`,
                                                value: `add: ${Number(quantity)} | ${item}`
                                            }
                                        ]);
                                    } else {
                                        return int.autocomplete([]);
                                    }
                                } else if (action == 'del') {
                                    let item = '';
                                    try {
                                        item = value.split(':')[1].trim();
                                    } catch (err) {
                                        item = '';
                                    }

                                    if (item.trim() == '') {
                                        const items = (
                                            focusedAttribute.value as unknown as {
                                                items: Array<{
                                                    name: string;
                                                    quantity: number;
                                                }>;
                                            }
                                        ).items;

                                        let autocompleteItems: { name: string; value: string }[] = [];
                                        for (let i = 0; i < items.length; i++) {
                                            if (i <= 10) {
                                                autocompleteItems.push({
                                                    name: `del: ${items[i].name}`,
                                                    value: `del: ${items[i].name}`
                                                });
                                            } else {
                                                break;
                                            }
                                        }

                                        return int.autocomplete(autocompleteItems);
                                    } else {
                                        const items = (
                                            focusedAttribute.value as unknown as {
                                                items: Array<{
                                                    name: string;
                                                    quantity: number;
                                                }>;
                                            }
                                        ).items;

                                        let itemSearch = similaritySearch(
                                            item,
                                            items.map(i => i.name)
                                        );

                                        let autocompleteItems: { name: string; value: string }[] = [];
                                        for (let i = 0; i < 10; i++) {
                                            if (itemSearch.allMatches[i]) {
                                                autocompleteItems.push({
                                                    name: `del: ${itemSearch.allMatches[i].value}`,
                                                    value: `del: ${itemSearch.allMatches[i].value}`
                                                });
                                            }
                                        }

                                        return int.autocomplete(autocompleteItems);
                                    }
                                } else if (action == 'mod') {
                                    let index = '';
                                    try {
                                        index = value.split('mod item')[1].split(':')[0].trim();
                                    } catch (err) {
                                        index = '';
                                    }

                                    let quantity = '';
                                    try {
                                        quantity = value.split(':')[1].trim().split('|')[0].trim();
                                    } catch (err) {
                                        quantity = '';
                                    }

                                    let item = '';
                                    try {
                                        item = value.split('|')[1].trim();
                                    } catch (err) {
                                        item = '';
                                    }

                                    if (
                                        (index == '' || isNaN(Number(index))) &&
                                        (quantity == '' || isNaN(Number(quantity))) &&
                                        item.trim() == ''
                                    ) {
                                        const items = (
                                            focusedAttribute.value as unknown as {
                                                items: Array<{
                                                    name: string;
                                                    quantity: number;
                                                }>;
                                            }
                                        ).items;

                                        let autocompleteItems: { name: string; value: string }[] = [];

                                        for (let i = 0; i < items.length; i++) {
                                            if (i <= 10) {
                                                let attribute = items[i];

                                                if (attribute) {
                                                    autocompleteItems.push({
                                                        name: `mod item ${i + 1}: ${attribute.quantity} | ${
                                                            attribute.name
                                                        }`,
                                                        value: `mod item ${i + 1}: ${attribute.quantity} | ${
                                                            attribute.name
                                                        }`
                                                    });
                                                }
                                            } else {
                                                break;
                                            }
                                        }

                                        return int.autocomplete(autocompleteItems);
                                    } else if (
                                        !isNaN(Number(index)) &&
                                        (quantity == '' || isNaN(Number(quantity))) &&
                                        item.trim() == ''
                                    ) {
                                        const items = (
                                            focusedAttribute.value as unknown as {
                                                items: Array<{
                                                    name: string;
                                                    quantity: number;
                                                }>;
                                            }
                                        ).items;

                                        const attribute = items[Number(index) - 1];

                                        return int.autocomplete([
                                            {
                                                name: `mod item ${Number(index)}: ${Number(attribute.quantity)} | ${
                                                    attribute.name
                                                }`,
                                                value: `mod item ${Number(index)}: ${Number(attribute.quantity)} | ${
                                                    attribute.name
                                                }`
                                            }
                                        ]);
                                    } else if (!isNaN(Number(index)) && !isNaN(Number(quantity)) && item.trim() == '') {
                                        const items = (
                                            focusedAttribute.value as unknown as {
                                                items: Array<{
                                                    name: string;
                                                    quantity: number;
                                                }>;
                                            }
                                        ).items;

                                        const attribute = items[Number(index) - 1];

                                        return int.autocomplete([
                                            {
                                                name: `mod item ${Number(index)}: ${Number(quantity)} | ${
                                                    attribute.name
                                                }`,
                                                value: `mod item ${Number(index)}: ${Number(quantity)} | ${
                                                    attribute.name
                                                }`
                                            }
                                        ]);
                                    } else if (!isNaN(Number(index)) && !isNaN(Number(quantity)) && item.trim() != '') {
                                        return int.autocomplete([
                                            {
                                                name: `mod item ${Number(index)}: ${Number(quantity)} | ${item}`,
                                                value: `mod item ${Number(index)}: ${Number(quantity)} | ${item}`
                                            }
                                        ]);
                                    } else {
                                        return int.autocomplete([]);
                                    }
                                }
                            }
                        } else if (focusedAttribute.type == Attribute_Type.BAR) {
                            const attributeValue = focusedAttribute.value as unknown as {
                                actual: number;
                                max: number;
                                min: number;
                                step: number;
                            };

                            if (attributeValue.actual == undefined) {
                                return int.autocomplete([
                                    {
                                        name: 'Exemplo: 50/100',
                                        value: '50/100'
                                    }
                                ]);
                            } else {
                                let value = int.getArgs().get('value').value;

                                if (value.trim() == '') {
                                    return int.autocomplete([
                                        {
                                            name: `+${attributeValue.step}`,
                                            value: `+${attributeValue.step}`
                                        },
                                        {
                                            name: `-${attributeValue.step}`,
                                            value: `-${attributeValue.step}`
                                        },
                                        {
                                            name: 'Exemplo: 10/100',
                                            value: '10/100'
                                        }
                                    ]);
                                } else {
                                    let action = value[0];
                                    let modifier = value.replace(action, '').trim();

                                    if (['+', '-'].includes(value[0])) {
                                        if (action == '+') {
                                            return int.autocomplete([
                                                {
                                                    name: `${attributeValue.actual + Number(modifier)}/${
                                                        attributeValue.max
                                                    }`,
                                                    value: `${attributeValue.actual + Number(modifier)}/${
                                                        attributeValue.max
                                                    }`
                                                }
                                            ]);
                                        } else if (action == '-') {
                                            return int.autocomplete([
                                                {
                                                    name: `${attributeValue.actual - Number(modifier)}/${
                                                        attributeValue.max
                                                    }`,
                                                    value: `${attributeValue.actual - Number(modifier)}/${
                                                        attributeValue.max
                                                    }`
                                                }
                                            ]);
                                        }
                                    } else if (value.search('/') != -1) {
                                        return int.autocomplete([
                                            {
                                                name: `${value}`,
                                                value: `${value}`
                                            }
                                        ]);
                                    } else {
                                        return int.autocomplete([
                                            {
                                                name: `+${attributeValue.step}`,
                                                value: `+${attributeValue.step}`
                                            },
                                            {
                                                name: `-${attributeValue.step}`,
                                                value: `-${attributeValue.step}`
                                            },
                                            {
                                                name: 'Exemplo: 10/100',
                                                value: '10/100'
                                            }
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                int.autocomplete([]);
            }
        } else if (focused.name === 'position') {
            //TODO: mostrar o atributo antes e depois da posição, também mostrar o número da ultima posição
            int.autocomplete([]);
        }
    }
};
