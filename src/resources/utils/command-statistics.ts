import db from '../../configs/database';
import { DateTime } from 'luxon';

class CommandsStatistics {
    async logCommand(data: {
        commandName: string;
        userId: number;
        status: 'SUCCESS' | 'FAILED';
        source_system: string;
    }) {
        await db.logs.create({
            data: {
                action_type: 'COMMAND',
                action_target: data.commandName,
                user_id: data.userId,
                status: data.status,
                source_system: data.source_system
            }
        });
    }

    async logComponent(data: {
        componentName: string;
        userId: number;
        status: 'SUCCESS' | 'FAILED';
        source_system: string;
    }) {
        await db.logs.create({
            data: {
                action_type: 'COMPONENT',
                action_target: data.componentName,
                user_id: data.userId,
                status: data.status,
                source_system: data.source_system
            }
        });
    }

    getTotalCount(type?: 'COMMAND' | 'COMPONENT') {
        if (type) {
            return db.logs.count({
                where: {
                    action_type: type
                }
            });
        } else {
            return db.logs.count();
        }
    }

    getTotalCountSince(dateMin?: DateTime, dateMax?: DateTime, type?: 'COMMAND' | 'COMPONENT') {
        if (!dateMin && !dateMax) {
            //last 24 hours
            dateMin = DateTime.now().minus({ days: 1 });
            dateMax = DateTime.now();
        } else if (!dateMin && dateMax) {
            throw new Error('dateMin is required when dateMax is provided');
        } else if (dateMin && !dateMax) {
            throw new Error('dateMax is required when dateMin is provided');
        }

        if (dateMin && dateMax) {
            if (dateMin > dateMax) {
                throw new Error('dateMin must be less than dateMax');
            }

            if (type) {
                return db.logs.count({
                    where: {
                        action_type: type,
                        timestamp: {
                            gte: dateMin.toJSDate(),
                            lte: dateMax.toJSDate()
                        }
                    }
                });
            } else {
                return db.logs.count({
                    where: {
                        timestamp: {
                            gte: dateMin.toJSDate(),
                            lte: dateMax.toJSDate()
                        }
                    }
                });
            }
        }
    }

    getTodayCount(type?: 'COMMAND' | 'COMPONENT') {
        const dateMin = DateTime.now().setZone('America/Fortaleza').startOf('day');
        const dateMax = DateTime.now().setZone('America/Fortaleza').endOf('day');
        return this.getTotalCountSince(dateMin, dateMax, type);
    }
}

const commandsStatistics = new CommandsStatistics();

export default commandsStatistics;
