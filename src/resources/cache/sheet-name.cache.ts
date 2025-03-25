import SheetController from '../../controllers/sheet.controller';
import logger from '../../configs/logger';

class SheetNameCache {
    private cache: Map<number, Array<string>> = new Map<number, Array<string>>();

    async loadCache() {
        let executionTime = new Date().getTime();

        const sheets: Sheet_Head[] | null = await SheetController.getAllSheetsHead();
        if (!sheets) {
            return;
        }

        for (let sheet of sheets) {
            if (!this.cache.has(sheet.user_id)) {
                this.cache.set(sheet.user_id, []);
            }

            this.cache.get(sheet.user_id)!.push(sheet.sheet_name);
        }

        executionTime = new Date().getTime() - executionTime;
        logger.logText('INFO', `Sheet names cache loaded in ${executionTime}ms`);
    }

    get(userId: number): Array<string> | null {
        if (!this.cache.has(userId)) {
            return null;
        }

        return this.cache.get(userId)!;
    }

    add(userId: number, sheetName: string) {
        if (!this.cache.has(userId)) {
            this.cache.set(userId, []);
        }

        this.cache.get(userId)!.push(sheetName);
    }

    remove(userId: number, sheetName: string) {
        if (!this.cache.has(userId)) {
            return;
        }

        const sheetNames = this.cache.get(userId)!;
        const index = sheetNames.indexOf(sheetName);
        if (index !== -1) {
            sheetNames.splice(index, 1);
        }
    }

    rename(userId: number, oldSheetName: string, newSheetName: string) {
        if (!this.cache.has(userId)) {
            return;
        }

        const sheetNames = this.cache.get(userId)!;
        const index = sheetNames.indexOf(oldSheetName);
        if (index !== -1) {
            sheetNames[index] = newSheetName;
        }
    }
}

const sheetNameCache = new SheetNameCache();

export default sheetNameCache;
