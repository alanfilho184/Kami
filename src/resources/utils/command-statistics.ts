import db from '../../configs/database';
import { Bot_Command_Type } from '../../types/enums';
import { DateTime } from 'luxon';
import logger from '../../configs/logger';

class CommandsStatistics {
    private commandsStatistics: Map<string, Bot_Command_Statistic>;
    constructor() {
        this.commandsStatistics = new Map();
        this.load();
    }

    async load() {
        this.clear();
        const commandsStatistics = await db.bot_commands_statistics.findMany();

        for (let commandStatistic of commandsStatistics) {
            this.commandsStatistics.set(commandStatistic.name, {
                id: commandStatistic.id,
                name: commandStatistic.name,
                type: commandStatistic.type as Bot_Command_Type,
                usage_total_count: commandStatistic.usage_total_count,
                usage_record: commandStatistic.usage_record as unknown as {
                    [day: string]: { count: number; uses: Date[] };
                }
            });
        }

        logger.logText('INFO', `Commands statistics loaded`);
    }

    clear() {
        this.commandsStatistics.clear();
    }

    get(commandName: string) {
        return this.commandsStatistics.get(commandName) || null;
    }

    async sumCommand(commandName: string) {
        const commandStatistic = this.commandsStatistics.get(commandName);
        const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd/LL/yyyy');

        if (commandStatistic) {
            commandStatistic.usage_total_count += 1;
            commandStatistic.usage_record[date] = {
                uses: commandStatistic.usage_record[date]?.uses
                    ? [
                          ...commandStatistic.usage_record[date]?.uses,
                          DateTime.now().setZone('America/Fortaleza').toJSDate()
                      ]
                    : [DateTime.now().setZone('America/Fortaleza').toJSDate()],
                count: commandStatistic.usage_record[date]?.count + 1 || 1
            };

            let days: string[] = [];
            for (let day in commandStatistic.usage_record) {
                days.push(day);
            }

            if (days.length > 60) {
                days = days.sort((a, b) => {
                    return (
                        DateTime.fromFormat(a, 'dd/LL/yyyy').toMillis() -
                        DateTime.fromFormat(b, 'dd/LL/yyyy').toMillis()
                    );
                });

                let olderDay = days[0];

                delete commandStatistic.usage_record[olderDay];
            }

            await db.bot_commands_statistics.update({
                where: { id: commandStatistic.id },
                data: {
                    usage_total_count: commandStatistic.usage_total_count,
                    usage_record: commandStatistic.usage_record
                }
            });
        } else {
            await db.bot_commands_statistics.create({
                data: {
                    name: commandName,
                    type: Bot_Command_Type.TEXT,
                    usage_total_count: 1,
                    usage_record: {
                        [date]: {
                            count: 1,
                            uses: [DateTime.now().setZone('America/Fortaleza').toJSDate()]
                        }
                    }
                }
            });

            this.load();
        }
    }

    async sumComponent(componentName: string) {
        const commandStatistic = this.commandsStatistics.get(componentName);
        const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd/LL/yyyy');

        if (commandStatistic) {
            commandStatistic.usage_total_count += 1;
            commandStatistic.usage_record[date] = {
                uses: commandStatistic.usage_record[date]?.uses
                    ? [
                          ...commandStatistic.usage_record[date]?.uses,
                          DateTime.now().setZone('America/Fortaleza').toJSDate()
                      ]
                    : [DateTime.now().setZone('America/Fortaleza').toJSDate()],
                count: commandStatistic.usage_record[date]?.count + 1 || 1
            };

            let days: string[] = [];
            for (let day in commandStatistic.usage_record) {
                days.push(day);
            }

            if (days.length > 60) {
                days = days.sort((a, b) => {
                    return (
                        DateTime.fromFormat(a, 'dd/LL/yyyy').toMillis() -
                        DateTime.fromFormat(b, 'dd/LL/yyyy').toMillis()
                    );
                });

                let olderDay = days[0];

                delete commandStatistic.usage_record[olderDay];
            }

            await db.bot_commands_statistics.update({
                where: { id: commandStatistic.id },
                data: {
                    usage_total_count: commandStatistic.usage_total_count,
                    usage_record: commandStatistic.usage_record
                }
            });
        } else {
            await db.bot_commands_statistics.create({
                data: {
                    name: componentName,
                    type: Bot_Command_Type.BUTTON,
                    usage_total_count: 1,
                    usage_record: {
                        [date]: {
                            count: 1,
                            uses: [DateTime.now().setZone('America/Fortaleza').toJSDate()]
                        }
                    }
                }
            });

            this.load();
        }
    }

    getTotalCount(type?: Bot_Command_Type) {
        let totalCount = 0;

        for (let commandStatistic of this.commandsStatistics.values()) {
            if (type) {
                if (commandStatistic.type === type) {
                    totalCount += commandStatistic.usage_total_count;
                }
            } else {
                totalCount += commandStatistic.usage_total_count;
            }
        }

        return totalCount;
    }

    getTotalCountSince(dateMin?: DateTime, dateMax?: DateTime, type?: Bot_Command_Type) {
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

            let totalCount = 0;

            for (let commandStatistic of this.commandsStatistics.values()) {
                if (type) {
                    if (commandStatistic.type === type) {
                        for (let date in commandStatistic.usage_record) {
                            if (
                                DateTime.fromFormat(date, 'dd/LL/yyyy').toMillis() >= dateMin.toMillis() &&
                                DateTime.fromFormat(date, 'dd/LL/yyyy').toMillis() <= dateMax.toMillis()
                            ) {
                                totalCount += commandStatistic.usage_record[date].count;
                            }
                        }
                    }
                } else {
                    for (let date in commandStatistic.usage_record) {
                        if (
                            DateTime.fromFormat(date, 'dd/LL/yyyy').toMillis() >= dateMin.toMillis() &&
                            DateTime.fromFormat(date, 'dd/LL/yyyy').toMillis() <= dateMax.toMillis()
                        ) {
                            totalCount += commandStatistic.usage_record[date].count;
                        }
                    }
                }
            }

            return totalCount;
        }
    }

    getTodayCount(type?: Bot_Command_Type) {
        let todayCount = 0;
        const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd/LL/yyyy');

        for (let commandStatistic of this.commandsStatistics.values()) {
            if (type) {
                if (commandStatistic.type === type) {
                    todayCount += commandStatistic.usage_record[date]?.count || 0;
                }
            } else {
                todayCount += commandStatistic.usage_record[date]?.count || 0;
            }
        }

        return todayCount;
    }
}

const commandsStatistics = new CommandsStatistics();

export default commandsStatistics;
