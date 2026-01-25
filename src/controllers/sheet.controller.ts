import db from '../configs/database';

type PreparedSheet = {
    sheet_name: Sheet_Name;
    user_id: number;
    sheet_password: string;
    is_public: boolean;
    attributes: {};
    legacy: false;
    last_use: Date;
};

type PreparedSheetUpdate = {
    sheet_name: Sheet_Name;
    is_public: boolean;
    attributes: {};
    legacy: false;
    last_use: Date;
};

function toSheet(sheet: any): Sheet | null {
    try {
        return {
            id: sheet.id,
            user_id: sheet.user_id,
            sheet_name: sheet.sheet_name,
            sheet_password: sheet.sheet_password,
            is_public: sheet.is_public,
            legacy: sheet.legacy,
            attributes: sheet.attributes,
            last_use: sheet.last_use
        };
    } catch (err) {
        return null;
    }
}

function toSheetArray(sheets: any[]): Sheet[] | null {
    try {
        return sheets.map(sheet => {
            return {
                id: sheet.id,
                user_id: sheet.user_id,
                sheet_name: sheet.sheet_name,
                sheet_password: sheet.sheet_password,
                is_public: sheet.is_public,
                legacy: sheet.legacy,
                attributes: sheet.attributes,
                last_use: sheet.last_use
            };
        });
    } catch (err) {
        return null;
    }
}

function toSheetHeadArray(sheets: any[]): Sheet_Head[] | null {
    try {
        return sheets.map(sheet => {
            return {
                id: sheet.id,
                user_id: sheet.user_id,
                sheet_name: sheet.sheet_name
            };
        });
    } catch (err) {
        return null;
    }
}

export default class SheetController {
    static async create(sheet: PreparedSheet): Promise<Sheet | null> {
        return toSheet(
            await db.sheets.create({
                data: {
                    user_id: sheet.user_id,
                    sheet_name: sheet.sheet_name.sheet_name,
                    sheet_password: sheet.sheet_password,
                    attributes: sheet.attributes,
                    is_public: sheet.is_public,
                    legacy: sheet.legacy,
                    last_use: sheet.last_use
                }
            })
        );
    }

    static async getById(id: number): Promise<Sheet | null> {
        return toSheet(
            await db.sheets.findUnique({
                where: {
                    id: id
                }
            })
        );
    }

    static async getByUserId(userId: number): Promise<Sheet_Head[] | null> {
        return toSheetHeadArray(
            await db.sheets.findMany({
                where: {
                    user_id: userId
                },
                select: {
                    id: true,
                    user_id: true,
                    sheet_name: true
                }
            })
        );
    }

    static async getByUserIdAndSheetName(userId: number, sheetName: string): Promise<Sheet | null> {
        return toSheet(
            await db.sheets.findFirst({
                where: {
                    user_id: userId,
                    sheet_name: sheetName
                }
            })
        );
    }

    static async getByUsernameAndSheetName(username: string, sheetName: string): Promise<Sheet | null> {
        const user = await db.users.findUnique({ where: { username: username } });

        if (user) {
            return toSheet(
                await db.sheets.findFirst({
                    where: {
                        user_id: user.id,
                        sheet_name: sheetName
                    }
                })
            );
        } else {
            return null;
        }
    }

    static async getAllSheetsHead(): Promise<Sheet_Head[] | null> {
        return toSheetHeadArray(
            await db.sheets.findMany({
                select: {
                    id: true,
                    user_id: true,
                    sheet_name: true
                }
            })
        );
    }

    static async updateById(id: number, newSheet: Sheet): Promise<Sheet | null> {
        return toSheet(
            await db.sheets.update({
                where: {
                    id: id
                },
                data: {
                    sheet_name: newSheet.sheet_name,
                    attributes: newSheet.attributes,
                    is_public: newSheet.is_public,
                    legacy: false,
                    last_use: newSheet.last_use
                }
            })
        );
    }

    static async deleteById(id: number): Promise<Sheet | null> {
        return toSheet(
            await db.sheets.delete({
                where: {
                    id: id
                }
            })
        );
    }
}
