import db from '../configs/database';
import SheetController from '../controllers/sheet.controller';
import { Sheet_Name } from '../types/validations';
import { Attribute_Type } from '../types/enums';

class SheetServices {
    //public static textRegex: RegExp = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]{1,}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ+#@$%&*{}()/.,;:?!'"-_| ]+){0,}$/gim;
    public static textRegex: RegExp =
        /([a-zA-Z0-9]+\(([a-zA-Z0-9\s<>.,;:?!@#$%¨&*()_+-={}\[\]\\|/?°ºª``^~]+\)))|((if|IF|or|OR|xor|XOR)(((\s+\(("|')([a-zA-Z0-9\s<>.,;:?!@#$%¨&*()_+-={}\[\]\\|/?°ºª``^~]+))("|')\))|(\s("|')([a-zA-Z0-9]+)("|'))))|(select|SELECT|insert|INSERT|update|UPDATE|delete|DELETE)|((\s+\*+\s)|(.+)|(\s+[a-zA-Z0-9]+))(from|FROM|into|INTO)((\s+[a-zA-Z0-9]\w+))|\s+(where|WHERE)/g;
    public static numberRegex: RegExp = /^(-?[0-9]+)$/gim;
    public static positiveNumberRegex: RegExp = /^([0-9]+)$/gim;
    public static imageRegex: RegExp = /https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)/gi;

    static async validateModification(
        sheet: Sheet,
        attribute_type: Attribute_Type,
        section: string,
        attribute: string,
        value: string,
        position?: number
    ): Promise<Array<{ field: string; code: string }> | Sheet> {
        const errors: Array<{ field: string; code: string }> = [];

        if (attribute_type == Attribute_Type.TEXT) {
            section = `${section}`;
            attribute = `${attribute}`;
            value = `${value}`;
            position = position ? parseInt(`${position}`) : undefined;

            if (attribute.length < 1 || attribute.length > 256) {
                errors.push({ field: 'attribute', code: 'name-size' });
            }

            if (this.textRegex.test(attribute)) {
                errors.push({ field: 'attribute', code: 'name-invalid' });
            }

            if (value.length < 1 || value.length > 1024) {
                errors.push({ field: 'value', code: 'value-size' });
            }

            if (this.textRegex.test(value)) {
                errors.push({ field: 'value', code: 'value-invalid' });
            }

            if (section.length < 1 || section.length > 256) {
                errors.push({ field: 'section', code: 'section-size' });
            }

            if (this.textRegex.test(section)) {
                errors.push({ field: 'section', code: 'section-invalid' });
            }

            if (position && position < 0) {
                errors.push({ field: 'position', code: 'position-invalid' });
            }
        } else if (attribute_type == Attribute_Type.NUMBER) {
            section = `${section}`;
            attribute = `${attribute}`;
            value = `${value}`;
            position = position ? parseInt(`${position}`) : undefined;

            if (attribute.length < 1 || attribute.length > 256) {
                errors.push({ field: 'attribute', code: 'name-size' });
            }

            if (this.textRegex.test(attribute)) {
                errors.push({ field: 'attribute', code: 'name-invalid' });
            }

            if (value.length < 1 || value.length > 1024) {
                errors.push({ field: 'value', code: 'value-size' });
            }

            if (this.numberRegex.test(value)) {
                errors.push({ field: 'value', code: 'value-invalid' });
            }

            if (section.length < 1 || section.length > 256) {
                errors.push({ field: 'section', code: 'section-size' });
            }

            if (this.textRegex.test(section)) {
                errors.push({ field: 'section', code: 'section-invalid' });
            }

            if (position && position < 0) {
                errors.push({ field: 'position', code: 'position-invalid' });
            }
        } else if (attribute_type == Attribute_Type.IMAGE) {
            section = `${section}`;
            attribute = `${attribute}`;
            value = `${value}`;
            position = position ? parseInt(`${position}`) : undefined;

            if (attribute.length < 1 || attribute.length > 256) {
                errors.push({ field: 'attribute', code: 'name-size' });
            }

            if (this.textRegex.test(attribute)) {
                errors.push({ field: 'attribute', code: 'name-invalid' });
            }

            if (value.length < 1 || value.length > 1024) {
                errors.push({ field: 'value', code: 'value-size' });
            }

            //TODO: Possivelmente mudar pra regex de url para não precisar do http/https
            if (!this.imageRegex.test(value)) {
                errors.push({ field: 'value', code: 'value-invalid' });
            }

            if (section.length < 1 || section.length > 256) {
                errors.push({ field: 'section', code: 'section-size' });
            }

            if (this.textRegex.test(section)) {
                errors.push({ field: 'section', code: 'section-invalid' });
            }

            if (position && position < 0) {
                errors.push({ field: 'position', code: 'position-invalid' });
            }
        } else if (attribute_type == Attribute_Type.LIST) {
            //TODO: implementar a conversão de texto pro atributo correto
            section = `${section}`;
            attribute = `${attribute}`;
            value = `${value}`;
            position = position ? parseInt(`${position}`) : undefined;

            let listItem = {
                action: value.split(':')[0],
                quantity: '',
                value: '',
                item: -1
            };

            //add: 2|texto do item
            //mod item 5: 1|texto do item
            //mod item 1: 1|novo texto do item
            //del: texto do item

            if (listItem.action === 'add') {
                listItem.value = value.split('|')[1].trim();
                listItem.quantity = value.split('|')[0];
                listItem.quantity = listItem.quantity.replace('add:', '').trim();
            } else if (listItem.action.startsWith('del')) {
                listItem.value = value.replace('del:', '').trim();
            } else if (listItem.action.startsWith('mod')) {
                listItem.value = value.split('|')[1].trim();
                listItem.item = parseInt(listItem.action.split('item')[1].split(':')[0].trim());
                listItem.quantity = value.split('|')[0].split(':')[1].trim();
            }

            if (attribute.length < 1 || attribute.length > 256) {
                errors.push({ field: 'attribute', code: 'name-size' });
            }

            if (this.textRegex.test(attribute)) {
                errors.push({ field: 'attribute', code: 'name-invalid' });
            }

            if (value.length < 1 || value.length > 1024) {
                errors.push({ field: 'value', code: 'value-size' });
            }

            if (this.textRegex.test(listItem.value)) {
                errors.push({ field: 'value', code: 'value-invalid' });
            }

            if (`${listItem.quantity}`.length > 32) {
                errors.push({ field: 'value', code: 'quantity-size' });
            }

            if (section.length < 1 || section.length > 256) {
                errors.push({ field: 'section', code: 'section-size' });
            }

            if (this.textRegex.test(section)) {
                errors.push({ field: 'section', code: 'section-invalid' });
            }

            if (position && position < 0) {
                errors.push({ field: 'position', code: 'position-invalid' });
            }

            if (listItem.action === 'add') {
                if (sheet.attributes.sections.find(s => s.name === section)) {
                    let sheet_section = sheet.attributes.sections.find(s => s.name === section);

                    if (!sheet_section) {
                        sheet_section = {
                            name: section,
                            position: sheet.attributes.sections.length,
                            attributes: [],
                            type: 0
                        };
                    }

                    let sheet_attribute = sheet_section.attributes.find(a => a.name === attribute);

                    if (sheet_attribute) {
                        if (sheet_attribute.type == Attribute_Type.LIST) {
                            let list = (
                                sheet_attribute.value as unknown as {
                                    items: Array<{ name: string; quantity: string | number }>;
                                }
                            ).items;

                            if (Array.isArray(list)) {
                                list.push({ name: listItem.value, quantity: listItem.quantity });
                            } else {
                                list = [{ name: listItem.value, quantity: listItem.quantity }];
                            }

                            //@ts-ignore
                            value = { items: list };
                        } else {
                            //@ts-ignore
                            value = { items: [{ name: listItem.value, quantity: listItem.quantity }] };
                        }
                    } else {
                        //@ts-ignore
                        value = { items: [{ name: listItem.value, quantity: listItem.quantity }] };
                    }
                } else {
                    //@ts-ignore
                    value = { items: [{ name: listItem.value, quantity: listItem.quantity }] };
                }
            } else if (listItem.action.startsWith('del')) {
                if (sheet.attributes.sections.find(s => s.name === section)) {
                    let sheet_section = sheet.attributes.sections.find(s => s.name === section);

                    if (!sheet_section) {
                        sheet_section = {
                            name: section,
                            position: sheet.attributes.sections.length,
                            attributes: [],
                            type: 0
                        };
                    }

                    let sheet_attribute = sheet_section.attributes.find(a => a.name === attribute);

                    if (sheet_attribute) {
                        if (sheet_attribute.type == Attribute_Type.LIST) {
                            let list = (
                                sheet_attribute.value as unknown as {
                                    items: Array<{ name: string; quantity: string | number }>;
                                }
                            ).items;

                            if (Array.isArray(list)) {
                                list = list.filter((item, index) => {
                                    return `${item.name}`.trim() !== listItem.value;
                                });
                            }

                            //@ts-ignore
                            value = { items: list };
                        }
                    }
                }
                //TODO: maybe add a else
            } else if (listItem.action.startsWith('mod')) {
                if (sheet.attributes.sections.find(s => s.name === section)) {
                    let sheet_section = sheet.attributes.sections.find(s => s.name === section);

                    if (!sheet_section) {
                        sheet_section = {
                            name: section,
                            position: sheet.attributes.sections.length,
                            attributes: [],
                            type: 0
                        };
                    }

                    let sheet_attribute = sheet_section.attributes.find(a => a.name === attribute);

                    if (sheet_attribute) {
                        if (sheet_attribute.type == Attribute_Type.LIST) {
                            let list = (
                                sheet_attribute.value as unknown as {
                                    items: Array<{ name: string; quantity: string | number }>;
                                }
                            ).items;

                            if (Array.isArray(list)) {
                                list = list.map((item, index) => {
                                    if (index + 1 === listItem.item) {
                                        item.name = listItem.value;
                                        item.quantity = listItem.quantity;
                                    }

                                    return item;
                                });
                            }

                            //@ts-ignore
                            value = { items: list };
                        }
                    }
                }
                //TODO: maybe add a else
            }
        } else if (attribute_type == Attribute_Type.BAR) {
            section = `${section}`;
            attribute = `${attribute}`;
            value = `${value}`;
            position = position ? parseInt(`${position}`) : undefined;

            let barItem = {
                action: value[0] == '+' ? 'add' : value[0] == '-' ? 'sub' : 'mod',
                value: ''
            };

            if (barItem.action === 'add') {
                barItem.value = value.replace('+', '').trim();
            } else if (barItem.action === 'sub') {
                barItem.value = value.replace('-', '').trim();
            } else if (barItem.action === 'mod') {
                barItem.value = value;
            }

            if (attribute.length < 1 || attribute.length > 256) {
                errors.push({ field: 'attribute', code: 'name-size' });
            }

            if (this.textRegex.test(attribute)) {
                errors.push({ field: 'attribute', code: 'name-invalid' });
            }

            if (value.length < 1 || value.length > 1024) {
                errors.push({ field: 'value', code: 'value-size' });
            }

            if (this.textRegex.test(value)) {
                errors.push({ field: 'value', code: 'value-invalid' });
            }

            if (section.length < 1 || section.length > 256) {
                errors.push({ field: 'section', code: 'section-size' });
            }

            if (this.textRegex.test(section)) {
                errors.push({ field: 'section', code: 'section-invalid' });
            }

            if (position && position < 0) {
                errors.push({ field: 'position', code: 'position-invalid' });
            }

            if (barItem.action === 'add') {
                if (sheet.attributes.sections.find(s => s.name === section)) {
                    let sheet_section = sheet.attributes.sections.find(s => s.name === section);

                    if (!sheet_section) {
                        errors.push({ field: 'section', code: 'section-not-found' });
                    } else {
                        let sheet_attribute = sheet_section.attributes.find(a => a.name === attribute);

                        if (sheet_attribute) {
                            if (sheet_attribute.type == Attribute_Type.BAR) {
                                let bar = sheet_attribute.value as unknown as {
                                    actual: number;
                                    max: number;
                                    min: number;
                                    step: number;
                                };

                                if (bar) {
                                    bar.actual += parseInt(barItem.value);

                                    //@ts-ignore
                                    value = bar;
                                } else {
                                    errors.push({ field: 'attribute', code: 'type-mismatch' });
                                }
                            } else {
                                errors.push({ field: 'attribute', code: 'type-mismatch' });
                            }
                        } else {
                            errors.push({ field: 'attribute', code: 'attribute-not-found' });
                        }
                    }
                }
            } else if (barItem.action === 'sub') {
                if (sheet.attributes.sections.find(s => s.name === section)) {
                    let sheet_section = sheet.attributes.sections.find(s => s.name === section);

                    if (!sheet_section) {
                        errors.push({ field: 'section', code: 'section-not-found' });
                    } else {
                        let sheet_attribute = sheet_section.attributes.find(a => a.name === attribute);

                        if (sheet_attribute) {
                            if (sheet_attribute.type == Attribute_Type.BAR) {
                                let bar = sheet_attribute.value as unknown as {
                                    actual: number;
                                    max: number;
                                    min: number;
                                    step: number;
                                };

                                if (bar) {
                                    bar.actual -= parseInt(barItem.value);

                                    //@ts-ignore
                                    value = bar;
                                } else {
                                    errors.push({ field: 'attribute', code: 'attribute-not-found' });
                                }
                            } else {
                                errors.push({ field: 'attribute', code: 'type-mismatch' });
                            }
                        } else {
                            errors.push({ field: 'attribute', code: 'attribute-not-found' });
                        }
                    }
                }
            } else if (barItem.action === 'mod') {
                if (sheet.attributes.sections.find(s => s.name === section)) {
                    let sheet_section = sheet.attributes.sections.find(s => s.name === section);

                    if (!sheet_section) {
                        errors.push({ field: 'section', code: 'section-not-found' });
                    } else {
                        let sheet_attribute = sheet_section.attributes.find(a => a.name === attribute);

                        if (sheet_attribute) {
                            if (sheet_attribute.type == Attribute_Type.BAR) {
                                let bar = sheet_attribute.value as unknown as {
                                    actual: number;
                                    max: number;
                                    min: number;
                                    step: number;
                                };

                                if (bar) {
                                    let barValue = barItem.value.split('/');
                                    bar.actual = parseInt(barValue[0]);
                                    bar.max = parseInt(barValue[1]);

                                    //@ts-ignore
                                    value = bar;
                                } else {
                                    let bar = {
                                        actual: parseInt(barItem.value.split('/')[0]),
                                        max: parseInt(barItem.value.split('/')[1]),
                                        min: 0,
                                        step: 1
                                    };

                                    //@ts-ignore
                                    value = bar;
                                }
                            } else {
                                errors.push({ field: 'attribute', code: 'type-mismatch' });
                            }
                        } else {
                            errors.push({ field: 'attribute', code: 'attribute-not-found' });
                        }
                    }
                }
            }
        } else {
            errors.push({ field: 'attribute_type', code: 'invalid' });
        }

        if (errors.length === 0) {
            let sheet_section = sheet.attributes.sections.find(s => s.name === section);

            if (!sheet_section) {
                sheet_section = { name: section, position: sheet.attributes.sections.length, attributes: [], type: 0 };
            }

            let sheet_attribute = sheet_section.attributes.find(a => a.name === attribute);

            if (!sheet_attribute) {
                position = position ? position : sheet_section.attributes.length;
                sheet_attribute = { name: attribute, value: value, position: position, type: attribute_type };
            } else {
                sheet_attribute.value = value;
                if (position) {
                    sheet_attribute.position = position;
                }

                if (sheet_attribute.type !== attribute_type) {
                    sheet_attribute.type = attribute_type;
                }
            }

            let attribute_index = sheet_section.attributes.findIndex(a => a.name === attribute);
            let section_index = sheet_section.position;

            if (attribute_index === -1) {
                if (position) {
                    sheet_section.attributes.splice(position, 0, sheet_attribute);
                } else {
                    sheet_section.attributes.push(sheet_attribute);
                }
            } else {
                sheet_section.attributes[attribute_index] = sheet_attribute;
            }

            sheet.attributes.sections[section_index] = sheet_section;
            sheet.last_use = new Date();

            return sheet;
        } else {
            return errors;
        }
    }
}

export default SheetServices;
