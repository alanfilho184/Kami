import logger from '../../configs/logger';

class ActionHandler {
    private actions: Map<string, { createdAt: Date; expireAt: Date; singleUse: boolean; run: Function }> = new Map();
    constructor() {
        setInterval(() => {
            this.clearExpiredActions();
        }, 10 * 60 * 1000);
    }

    registerAction(id: string, data: { action: Function; expireAt?: Date; singleUse?: boolean }): void {
        const now = new Date();
        this.actions.set(id, {
            createdAt: now,
            expireAt: data.expireAt ? data.expireAt : new Date(now.getTime() + 18 * 60 * 1000),
            singleUse: data.singleUse ? true : false,
            run: data.action
        });
    }

    executeAction(id: string, ...args: any[]): unknown | void {
        const action = this.actions.get(id);

        if (action) {
            if (action.expireAt > new Date()) {
                try {
                    if (action.singleUse) {
                        this.deleteAction(id);
                    }

                    return action.run(...args);
                } catch (err) {
                    logger.logText('WARN', `Error executing action "${id}": ${err}`);
                }
            }
        }
    }

    deleteAction(id: string): void {
        this.actions.delete(id);
    }

    clearExpiredActions(): void {
        const now = new Date();
        this.actions.forEach((action, id) => {
            if (action.expireAt < now) {
                this.actions.delete(id);
            }
        });
    }
}

const actionHandler = new ActionHandler();

export default actionHandler;
