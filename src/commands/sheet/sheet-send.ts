import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import db from '../../configs/database';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { ButtonStyle } from 'discord-api-types/v10';
import { Attribute_Type } from '../../types/enums';
import sheetNameCache from '../../resources/cache/sheet-name.cache';
import { similaritySearch } from '../../resources/utils/string-similarity';
import SheetController from '../../controllers/sheet.controller';

function toTextAttribute(attribute: { name: string; value: string; type: number; position: number }) {
    let name = `${attribute.name}`;
    let value = `${attribute.value}`;
    let type = Number(attribute.type);
    let position = Number(attribute.position);

    if (type === Attribute_Type.TEXT) {
        if (name.length > 256) {
            return `name|overflow|${position}`;
        } else if (value.length > 1024) {
            return `value|overflow|${position}`;
        }

        return {
            name: name,
            value: value,
            inline: !(value.length > 32)
        };
    } else {
        return false;
    }
}

function toNumberAttribute(attribute: { name: string; value: string; type: number; position: number }) {
    let name = `${attribute.name}`;
    let value = Number(attribute.value);
    let type = Number(attribute.type);
    let position = Number(attribute.position);

    if (type === Attribute_Type.NUMBER) {
        if (name.length > 256) {
            return `name|overflow|${position}`;
        } else if (value > 1024) {
            return `value|overflow|${position}`;
        }

        return {
            name: name,
            value: `${value}`,
            inline: true
        };
    } else {
        return false;
    }
}

function toImageAttribute(attribute: { name: string; value: string; type: number; position: number }) {
    let name = `${attribute.name}`;
    let value = `${attribute.value}`;
    let type = Number(attribute.type);
    let position = Number(attribute.position);

    if (type === Attribute_Type.IMAGE) {
        if (value === 'image') {
            return {
                thumbnail: {
                    url: `${value}`
                }
            };
        } else {
            if (name.length > 256) {
                return `name|overflow|${position}`;
            }

            return {
                name: name,
                value: value,
                inline: true
            };
        }
    } else {
        return false;
    }
}

function toListAttribute(attribute: { name: string; value: string; type: number; position: number }) {
    let name = `${attribute.name}`;
    let value = attribute.value as unknown as { items: { name: string; quantity: number }[] };
    let type = Number(attribute.type);
    let position = Number(attribute.position);

    if (type === Attribute_Type.LIST) {
        if (name.length > 256) {
            return `name|overflow|${position}`;
        }

        let listValue = '';

        for (let item of value.items) {
            listValue += `${item.quantity}x ${item.name}\n`;
        }

        listValue.slice(listValue.length - 1, 1);

        if (listValue.length > 1024) {
            return `value|overflow|${position}`;
        }

        return {
            name: name,
            value: listValue,
            inline: true
        };
    } else {
        return false;
    }
}

function toBarAttribute(attribute: { name: string; value: string; type: number; position: number }) {
    let name = `${attribute.name}`;
    let value = attribute.value as unknown as { max: number; min: number; step: number; actual: number };
    let type = Number(attribute.type);
    let position = Number(attribute.position);

    if (type === Attribute_Type.BAR) {
        if (name.length > 256) {
            return `name|overflow|${position}`;
        }

        let barValue = `${value.actual}/${value.max}`;

        if (barValue.length > 1024) {
            return `value|overflow|${position}`;
        }

        return {
            name: name,
            value: barValue,
            inline: true
        };
    } else {
        return false;
    }
}

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'ficha_enviar',
        en_us: 'sheet_send'
    },
    fullNames: {
        pt_br: 'Enviar ficha',
        en_us: 'Sheet send'
    },
    descriptions: {
        pt_br: 'Envia uma ficha já criada em forma de embed.',
        en_us: "Sends a sheet already as a Discord's embed"
    },
    arguments: {
        pt_br: [
            {
                name: 'nome_da_ficha',
                description: 'Nome da ficha que deseja enviar.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'opções',
                description: 'Opções para a mensagem que a ficha será enviada.',
                type: 'STRING',
                required: false,
                choices: [
                    {
                        name: 'Manter mensagem sincronizada com a ficha',
                        return: 'sync'
                    }
                ]
            }
        ],
        en_us: [
            {
                name: 'sheet_name',
                description: 'The name of the sheet you want to send.',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'options',
                description: 'Options for the message that the sheet will be sent.',
                type: 'STRING',
                required: false,
                choices: [
                    {
                        name: 'Keep message synchronized with the sheet',
                        return: 'sync'
                    }
                ]
            }
        ]
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        // TODO; Implementar a opção de sincronizar a mensagem com a ficha
        const sheetName = int.getArgs().get('sheet_name').value;
        const keepSync = int.getArgs().get('options')?.value === 'sync';

        const sheet = await SheetController.getByUserIdAndSheetName(int.kami_user?.id!, sheetName);

        if (!sheet) {
            return int.reply({
                content: localization(language, 'sheet-send|sheet-not-found', [
                    { replace: '$sheet$', value: sheetName }
                ])
            });
        }

        sheet.user = int.kami_user!;

        const embeds = createSheetEmbed(sheet, language);

        int.reply({
            // @ts-ignore
            embeds: embeds
        });

        return;
    },
    autocomplete(int: Interaction, language: Available_Languages) {
        const sheets = sheetNameCache.get(int.kami_user?.id!);

        if (sheets) {
            let sheetNames: Set<string> = new Set();
            let sheetsNamesArray: { name: string; value: string }[] = [];

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

function createSheetEmbed(sheet: Sheet, language: Available_Languages) {
    let embeds: EmbedBuilder[] = new Array();

    if (sheet.legacy == true) {
        let attributeListSize = Object.keys(sheet.attributes).length;
        let sectionListSize = Math.ceil(attributeListSize / 25);

        let sections: { attributes: Attribute[]; name: string; position: number; type: Section_Type }[] = <
            { attributes: Attribute[]; name: string; position: number; type: Section_Type }[]
        >[];
        for (let s = 0; s < sectionListSize; s++) {
            sections.push({
                name: `Info ${s + 1}`,
                attributes: [],
                position: s,
                type: 0
            });
        }

        const convertedSheet = {
            attributes: { sections: sections },
            id: sheet.id,
            sheet_name: sheet.sheet_name,
            user_id: sheet.user_id,
            sheet_passoword: sheet.sheet_password,
            is_public: sheet.is_public,
            legacy: true,
            user: sheet.user
        };

        let absolutePosition = 0;
        let sectionPosition = 0;
        let section = 0;
        for (let attribute of Object.keys(sheet.attributes)) {
            if (sectionPosition >= 25) {
                sectionPosition = 0;
                section++;
            }

            convertedSheet.attributes.sections[section].attributes.push({
                name: attribute,
                value: sheet.attributes[attribute],
                type: isNaN(Number(sheet.attributes[attribute])) ? 0 : 1,
                position: absolutePosition
            });

            absolutePosition++;
            sectionPosition++;
        }

        // @ts-ignore
        sheet = convertedSheet;
    }

    let legacy = {
        descricao: ''
    };

    for (let section of sheet.attributes.sections) {
        let embed = new EmbedBuilder();
        embed.setTitle(section.name);
        embed.setColor(parseInt(config.EMBED_COLOR));

        for (let attribute of section.attributes) {
            let processedAttribute: boolean | string | { name: string; value: string; inline: boolean } = false;
            switch (parseInt(`${attribute.type}`)) {
                case Attribute_Type.TEXT:
                    // @ts-ignore
                    processedAttribute = toTextAttribute(attribute);
                    break;
                case Attribute_Type.NUMBER:
                    // @ts-ignore
                    processedAttribute = toNumberAttribute(attribute);
                    break;
                case Attribute_Type.IMAGE:
                    // @ts-ignore
                    processedAttribute = toImageAttribute(attribute);
                    break;
                case Attribute_Type.LIST:
                    // @ts-ignore
                    processedAttribute = toListAttribute(attribute);
                    break;
                case Attribute_Type.BAR:
                    // @ts-ignore
                    processedAttribute = toBarAttribute(attribute);
                    break;
            }

            if (processedAttribute === false) {
                continue;
            } else if (typeof processedAttribute === 'string') {
                //error só pode ser overflow por enquanto
                const [local, error, position] = processedAttribute.split('|');

                if (local === 'name') {
                    embed.addFields({
                        name: 'Erro',
                        value: localization(language, 'sheet-send|name-overflow', [
                            { replace: '$position$', value: position }
                        ])
                    });
                } else if (local === 'value') {
                    embed.addFields({
                        name: 'Erro',
                        value: localization(language, 'sheet-send|value-overflow', [
                            { replace: '$position$', value: position }
                        ])
                    });
                }
            } else {
                if (attribute.type == Attribute_Type.IMAGE) {
                    // @ts-ignore
                    embed.setThumbnail(processedAttribute.value);
                } else if (sheet.legacy == true && typeof processedAttribute == 'object') {
                    if (processedAttribute.name == 'descricao') {
                        legacy.descricao = processedAttribute.value;
                    } else if (processedAttribute.name == 'imagem') {
                        embed.setThumbnail(processedAttribute.value);
                    } else {
                        // @ts-ignore
                        embed.addFields(processedAttribute);
                    }
                } else {
                    // @ts-ignore
                    embed.addFields(processedAttribute);
                }
            }
        }

        embeds.push(embed);
    }

    if (sheet.legacy) {
        if (legacy.descricao) {
            let descricaoEmbed = new EmbedBuilder();
            descricaoEmbed.setTitle(localization(language, 'sheet-send|description'));
            descricaoEmbed.setDescription(legacy.descricao);
            descricaoEmbed.setColor(parseInt(config.EMBED_COLOR));

            embeds.push(descricaoEmbed);
        }

        embeds[0].setTitle(
            localization(language, 'sheet-send|title-legacy', [
                { replace: '$sheet$', value: sheet.sheet_name },
                { replace: '$username$', value: sheet.user!.username }
            ])
        );
    } else {
        embeds[0].setTitle(
            localization(language, 'sheet-send|title', [
                { replace: '$section$', value: sheet.attributes.sections[0].name },
                { replace: '$sheet$', value: sheet.sheet_name },
                { replace: '$username$', value: sheet.user!.username }
            ])
        );
    }

    embeds[0].setAuthor({
        name: localization(language, 'sheet-send|link'),
        url: `https://kamiapp.com.br/ficha/${sheet.user!.id}/${sheet.sheet_name}`
    });

    return embeds;
}
