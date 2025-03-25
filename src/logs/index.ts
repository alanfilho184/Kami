import { DateTime } from 'luxon';
import fs from 'node:fs';
import path from 'path';
import { inspect } from 'util';
import color from 'colors';
import { sendCommandWebhook, sendLogWebhook } from './discord-logger';
// import { Socket } from 'socket.io';
import { Request, Response } from 'express';
import { Interaction } from '../resources/utils/interaction-handler';
import { EmbedBuilder } from '@discordjs/builders';

import commands from '../commands';
import components from '../components';
import { InteractionType } from 'discord-interactions';
import config from '../configs/config';

const mask = ['token', 'authorization'];
function maskData(obj: any): void {
    if (Array.isArray(obj)) {
        obj.forEach((element: unknown) => {
            maskData(element);
        });
    } else if (typeof obj == 'object') {
        for (const key in obj) {
            if (mask.includes(key)) {
                obj[key] = '*';
            } else {
                maskData(obj[key]);
            }
        }
    } else {
        return;
    }
}

export default class Logger {
    logFile: string;
    constructor() {
        const day = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy');

        try {
            fs.readFileSync(path.join(__dirname, `log-${day}.kami`));
        } catch (err) {
            fs.writeFileSync(path.join(__dirname, `log-${day}.kami`), '');
        }

        this.logFile = path.join(__dirname, `log-${day}.kami`);

        process.on('uncaughtException', err => {
            this.logText('ERROR', err, true);
        });

        process.on('unhandledRejection', err => {
            this.logText('ERROR', err, true);
        });

        this.rotateLogs();
    }

    public logHttp(req: Request, res: Response, responseBody: unknown): void {
        if (req.baseUrl == '/interactions') {
            return this.logText('WARN', 'For discord interactions use logDiscord method');
        }

        const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy');

        if (path.join(__dirname, `log-${date}.kami`) == this.logFile) {
            maskData(req.body);
            maskData(req.query);
            maskData(responseBody);

            if (req.baseUrl == '/logs') {
                responseBody = 'Log file is not registered to avoid duplication';
            }

            let log = {
                type: 'HTTP',
                date: DateTime.now().setZone('America/Fortaleza').toMillis(),
                status: res.statusCode,
                method: req.method,
                route: `${req.originalUrl.split('?')[0]}`,
                query: req.query ? req.query : null,
                params: req.params ? req.params : null,
                requestBody: req.body ? req.body : null,
                responseBody: responseBody ? responseBody : null,
                executionTime: (DateTime.now().toMillis() - req.startTime).toString(),
                ip: req.ip
            };

            // eventEmitter.emit('logger', log);

            fs.appendFileSync(this.logFile, `${JSON.stringify(log, null, 2)}&,&`);
        } else {
            fs.writeFileSync(path.join(__dirname, `log-${date}.kami`), '');
            this.logFile = path.join(__dirname, `log-${date}.kami`);
            this.logHttp(req, res, responseBody);
        }
    }

    // public logWS(
    //     socket: Socket,
    //     acao: 'Conexao' | 'Desconexao' | 'Evento Recebido' | 'Evento Enviado',
    //     evento: string,
    //     args: any[]
    // ): void {
    //     const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy');

    //     if (path.join(__dirname, `log-${date}.kami`) == this.logFile) {
    //         let log: any = {};

    //         if (acao == 'Conexao' || acao == 'Desconexao') {
    //             log = {
    //                 type: 'WS',
    //                 date: DateTime.now().setZone('America/Fortaleza').toMillis(),
    //                 acao: acao,
    //                 socketId: socket.id,
    //                 ip: socket.handshake.address,
    //                 usuario: socket.date ? socket.date : null
    //             };
    //         } else if (acao == 'Evento Recebido' || acao == 'Evento Enviado') {
    //             mascararDados(args);

    //             log = {
    //                 type: 'WS',
    //                 date: DateTime.now().setZone('America/Fortaleza').toMillis(),
    //                 acao: acao,
    //                 socketId: socket.id,
    //                 ip: socket.handshake.address,
    //                 usuario: socket.date ? socket.date : null,
    //                 evento: evento,
    //                 args: args
    //             };

    //             if (log.evento == 'log') {
    //                 log.args = 'Evento de log (Não registrado para evitar duplicidade)';
    //             }
    //         }

    //         if (
    //             (log.evento && log.evento != 'log' && log.evento != 'ping') ||
    //             log.acao == 'Conexao' ||
    //             log.acao == 'Desconexao'
    //         ) {
    //             eventEmitter.emit('logger', log);
    //         }

    //         if (
    //             (log.evento && log.evento != 'ping' && log.evento != 'log') ||
    //             (log.acao == 'Conexao' && log.acao == 'Desconexao')
    //         ) {
    //             fs.appendFileSync(this.logFile, `${JSON.stringify(log, null, 2)}&,&`);
    //         }
    //     } else {
    //         fs.writeFileSync(path.join(__dirname, `log-${date}.kami`), '');
    //         this.logFile = path.join(__dirname, `log-${date}.kami`);
    //         this.logWS(socket, acao, evento, args);
    //     }
    // }

    // public logWSCallback(socket: Socket, evento: string, args: any[], callback: object) {
    //     const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy');

    //     if (path.join(__dirname, `log-${date}.kami`) == this.logFile) {
    //         mascararDados(args);

    //         let log = {
    //             type: 'WS',
    //             date: DateTime.now().setZone('America/Fortaleza').toMillis(),
    //             acao: 'Callback',
    //             socketId: socket.id,
    //             ip: socket.handshake.address,
    //             usuario: socket.date ? socket.date : null,
    //             evento: evento,
    //             args: args,
    //             callback: callback
    //         };

    //         eventEmitter.emit('logger', log);
    //         fs.appendFileSync(this.logFile, `${JSON.stringify(log, null, 2)}&,&`);

    //         let time = DateTime.now().setZone('America/Fortaleza').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    //         const info = `Usuário: [ID: ${socket.date.id} Grupo: ${socket.date.grupoId}]`;

    //         console.log(
    //             `[ ${color.green(time)} ] - [ WS Callback ${color.green(evento)} ] - [ ${color.cyan(
    //                 info
    //             )} ] - [ ${color.cyan(`Callback Body: ${JSON.stringify(callback)}`)} ]\n`
    //         );
    //     } else {
    //         fs.writeFileSync(path.join(__dirname, `log-${date}.kami`), '');
    //         this.logFile = path.join(__dirname, `log-${date}.kami`);
    //         this.logWSCallback(socket, evento, args, callback);
    //     }
    // }

    public logText(level: 'INFO' | 'WARN' | 'ERROR', message: unknown, automated: boolean = false): void {
        const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy');

        if (path.join(__dirname, `log-${date}.kami`) == this.logFile) {
            let log = {
                type: 'LOG',
                level: level,
                date: DateTime.now().setZone('America/Fortaleza').toMillis(),
                message: message,
                automated: automated
            };

            console.log(
                `[ ${color.green(
                    DateTime.now().setZone('America/Fortaleza').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
                )} ] - [ ${color[level == 'INFO' ? 'green' : level == 'WARN' ? 'yellow' : 'red'](level)} ]\n${
                    typeof message == 'object' ? inspect(message, false, 99) : message
                }\n---------------------------\n`
            );

            if (level == 'ERROR' || level == 'WARN') {
                let log = '';
                if (typeof message == 'object') {
                    log = inspect(message, false, 99);
                } else {
                    log = `${message}`;
                }

                sendLogWebhook(
                    new EmbedBuilder()
                        .setTitle(level)
                        .setDescription('```js\n' + log + '```')
                        .addFields({
                            name: 'Automatizado: ',
                            value: automated ? 'Sim' : 'Não',
                            inline: true
                        })
                        .setColor(parseInt(config.EMBED_COLOR))
                        .setFooter({
                            text: `Registrado em: ${DateTime.now()
                                .setZone('America/Sao_Paulo')
                                .toFormat('dd/MM/y | HH:mm:ss ')} (GMT -3)`
                        }),
                    level == 'ERROR'
                );
            }

            // eventEmitter.emit('logger', log);
            fs.appendFileSync(this.logFile, `${JSON.stringify(log, null, 2)}&,&`);
        } else {
            fs.writeFileSync(path.join(__dirname, `log-${date}.kami`), '');
            this.logFile = path.join(__dirname, `log-${date}.kami`);
            this.logText(level, message, automated);
        }
    }

    public async logDiscord(int: Interaction): Promise<void> {
        const date = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy');

        if (path.join(__dirname, `log-${date}.kami`) == this.logFile) {
            const executionDate = DateTime.fromMillis(int.createdTimestamp).setZone('America/Fortaleza')

            let log = {
                type: 'DISCORD',
                date: executionDate.toMillis(),
                user: int.user,
                interaction_type: int.type,
                interaction_id: int.id,
                guild_id: int.guild_id,
                guild_locale: int.guild_locale,
                channel: {
                    id: int.channel_id,
                    type: int.channel.type,
                    //@ts-ignore
                    name: int.channel.name
                },
                data: int.data,
                component: int.component,
                id: int.id,
                createdTimestamp: int.createdTimestamp,
                version: int.version,
                language: int.language
            };

            let type = '';
            let cmd = '';
            let args = '';
            let language = '';

            if (int.type == InteractionType.APPLICATION_COMMAND) {
                type = 'Comando';
                cmd = int.data.name;
                args = int.data.options
                    ? int.data.options
                          .map((opt: { name: string; value: string }) => `${opt.name}: ${opt.value}`)
                          .join(', ')
                    : 'Sem argumentos';
                language = int.language;

                if (!commands.get(cmd)) {
                    this.logText('WARN', `Comando não encontrado: ${cmd}`);
                }
            } else if (int.type == InteractionType.MESSAGE_COMPONENT) {
                type = 'Componente';
                cmd = int.component!.name;
                args = int.component!.args;
                language = int.language;

                if (!components.get(cmd)) {
                    this.logText('WARN', `Componente não encontrado: ${cmd}`);
                }
            }

            console.log(
                `[ ${color.green(
                    executionDate.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
                )} ] - [ ${color.green('DISCORD')} ]\n${inspect(
                    {
                        user: `${log.user.global_name} - ${log.user.id}`,
                        interaction_type: type,
                        cmd: cmd,
                        args: args,
                        language: language
                    },
                    false,
                    99
                )}\n---------------------------\n`
            );

            const intLogEmbed = new EmbedBuilder()
                .setTitle(type + ': ' + '`' + cmd + '`')
                .setAuthor({
                    name: `${int.user.global_name} - ${int.user.id}`,
                    iconURL: `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}`
                })
                .setDescription('**Args:**\n' + '`' + args + '`')
                .addFields({ name: 'Idioma: ', value: '`' + language + '`', inline: true })
                .setFooter({
                    text: 'Executado em: ' + executionDate.toFormat('dd/MM/y | HH:mm:ss ') + '(GMT -3)'
                })
                .setColor(parseInt(config.EMBED_COLOR));

            if (int.inGuild()) {
                intLogEmbed.addFields([
                    {
                        name: 'Servidor: ',
                        value: '`' + int.guild_id + '`',
                        inline: true
                    },
                    {
                        name: 'Canal: ',
                        // @ts-ignore
                        value: '`' + int.channel_id + '`' + ' - ' + '`' + int.channel.name + '`'
                    }
                ]);
            } else {
                intLogEmbed.addFields([
                    {
                        name: 'Local: ',
                        value: '`' + 'DM' + '`',
                        inline: true
                    }
                ]);
            }

            sendCommandWebhook(intLogEmbed);
            // eventEmitter.emit('logger', log);

            fs.appendFileSync(this.logFile, `${JSON.stringify(log, null, 2)}&,&`);
        } else {
            fs.writeFileSync(path.join(__dirname, `log-${date}.kami`), '');
            this.logFile = path.join(__dirname, `log-${date}.kami`);
            this.logDiscord(int);
        }
    }

    private async rotateLogs(): Promise<void> {
        let logs = fs.readdirSync(path.join(__dirname));

        logs = logs.filter(fileName => {
            return fileName.match(/\.kami$/g) != null;
        });

        for (let _i = 0; _i < logs.length; _i++) {
            if (logs.length > 30) {
                let older = DateTime.now().setZone('America/Fortaleza');
                logs.forEach((log: string) => {
                    const logTime = DateTime.fromFormat(
                        log.replace('log-', '').replace('.kami', ''),
                        'dd-LL-yyyy'
                    ).setZone('America/Fortaleza');

                    if (logTime.toMillis() < older.toMillis()) {
                        older = logTime;
                    }
                });

                fs.rmSync(path.join(__dirname, `log-${older.toFormat('dd-LL-yyyy')}.kami`));
                logs = logs.filter(fileName => {
                    const logTime = DateTime.fromFormat(
                        fileName.replace('log-', '').replace('.kami', ''),
                        'dd-LL-yyyy'
                    ).setZone('America/Fortaleza');

                    if (logTime.toMillis() == older.toMillis()) {
                        return false;
                    } else {
                        return true;
                    }
                });
            } else {
                break;
            }
        }
    }

    public getLog(date: DateTime): string | false {
        const day: string = date.toFormat('dd-LL-yyyy');

        try {
            return fs.readFileSync(path.join(__dirname, `log-${day}.kami`)).toString();
        } catch (err) {
            return false;
        }
    }
}
