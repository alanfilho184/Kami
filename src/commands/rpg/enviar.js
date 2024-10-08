module.exports = class enviar {
    constructor() {
        return {
            ownerOnly: false,
            name: 'enviar',
            nameEn: 'send',
            fName: 'Enviar',
            fNameEn: 'Send',
            desc: 'Envia uma ficha já criada em forma de embed.',
            descEn: "Sends a sheet already as a Discord's embed.",
            args: [
                {
                    name: 'nome_da_ficha',
                    desc: 'Nome da ficha que deseja enviar.',
                    type: 'STRING',
                    required: true,
                    autocomplete: true
                }
            ],
            argsEn: [
                {
                    name: 'sheet_name',
                    desc: 'Name of the sheet you want to send.',
                    type: 'STRING',
                    required: true,
                    autocomplete: true
                }
            ],
            options: [
                {
                    name: 'opções',
                    required: false,
                    type: 'STRING',
                    desc: 'Opções para o comando.',
                    choices: [{ name: 'Ativar IRT (Atualização em tempo real).', return: 'irt' }]
                }
            ],
            optionsEn: [
                {
                    name: 'options',
                    required: false,
                    type: 'STRING',
                    desc: 'Command options.',
                    choices: [{ name: 'Activate IRT (In Real Time update).', return: 'irt' }]
                }
            ],
            type: 1,
            helpPt: {
                title: '<:fichaAjuda:766790214550814770> ' + '/' + 'enviar',
                desc: `
            Este comando serve para receber a sua ficha como embed do Discord
        
            _Formato do comando:_
            **${'/'}enviar <nome_da_ficha>**
            
            Ex: **${'/'}enviar RPG_Kami**
            
            Para enviar uma ficha que atualiza automaticamente ao utilizar o comando /ficha, basta utlizar:
            **${'/'}enviar <nome_da_ficha> irt**
        
            Ex: **${'/'}enviar RPG_Kami irt**
        
            **Essa ainda é uma função que está em fase de testes, problemas podem ocorrer. Atualmente está limitado a 5 fichas IRT por usuário.
            Para desativar o IRT basta utilizar os botões na ficha
            `
            },

            helpEn: {
                title: '<:fichaAjuda:766790214550814770> ' + '/' + 'send',
                desc: `
            This command is used to receive your sheet as a discord message. If you have only one sheet created you can use only **${'/'}send**.
        
            _Format of the command:_
            **${'/'}enviar <sheet_name>**
        
            Ex: ${'/'}enviar RPG_Kami

            To send a sheet that automatically updates when using the /sheet command, simply utlize:
            **${'/'}enviar <sheet_name> irt**
        
            Ex: **${'/'}enviar RPG_Kami irt**
        
            **This is still a function that is in testing phase, problems may occur. It is currently limited to 5 IRT sheets per user.
            To disable IRT just use the buttons on the sheet
            `
            },
            run: this.execute,
            create: this.create,
            autocomplete: this.autocomplete
        };
    }
    async execute(client, int) {
        const secret = client.utils.secret(await client.cache.get(int.user.id), 'enviar');
        int.deferReply({ ephemeral: secret }).then(async () => {
            const args = client.utils.args(int);

            const beta = client.whitelist.get('beta');

            var nomerpg = args.get('sheet_name');
            var irtUpdt = args.get('options');

            try {
                nomerpg = nomerpg.replace("'", '');
            } catch {}

            if (!nomerpg) {
                try {
                    var fichasUser = await client.cache.get(int.user.id).fPadrao;
                    nomerpg = fichasUser;
                } catch (err) {
                    fichasUser = undefined;
                }

                if (!fichasUser) {
                    const fichasUser = await client.cache.getFichasUser(int.user.id);

                    if (fichasUser.length > 1) {
                        return int.editReply(client.tl({ local: int.lang + 'efd-mFichas1', fichasUser: fichasUser }));
                    } else if (fichasUser.length == 1) {
                        nomerpg = fichasUser[0];
                    } else {
                        return int.editReply(client.tl({ local: int.lang + 'efd-uSF' }));
                    }
                }
            }

            try {
                nomerpg = nomerpg.replace("'", '');
            } catch {}

            await client.cache
                .getFicha(int.user.id, nomerpg)
                .then(async fichaUser => {
                    if (fichaUser) {
                        if (fichaUser.atributos['imagem'] == '-' || fichaUser.atributos['imagem'] == null) {
                            fichaUser.atributos['imagem'] = '';
                        }

                        try {
                            irtUpdt = irtUpdt.toLowerCase();
                        } catch (err) {}

                        try {
                            if (irtUpdt != 'irt') {
                                const reply = this.create(client, int, fichaUser);
                                const embedsArray = Object.values(reply);

                                int.editReply({ embeds: reply }).catch(err => {
                                    if (err.name + err.message.split(/\n/)[0] == 'DiscordAPIErrorInvalid Form Body') {
                                        if (
                                            err.message.split(/\n/)[1] ==
                                            'embeds: Embed size exceeds maximum size of 6000'
                                        ) {
                                            int.editReply(
                                                client.tl({ local: int.lang + 'efd-fCE' }) +
                                                    '\n' +
                                                    client.tl({ local: int.lang + 'efd-fE2' })
                                            );
                                        } else {
                                            const errs = err.message.split(/\n/);
                                            errs.shift();

                                            var errMsg = '';

                                            errs.forEach(err => {
                                                const local = err.match(/\d+(?=])/g);
                                                var type = err.match(/[a-z]+(?=\:)/g);
                                                const maxSize = err.match(/[0-9]+(?= )/g);

                                                if (int.lang == 'pt-') {
                                                    if (type == 'value') {
                                                        type = 'valor';
                                                    } else if (type == 'name') {
                                                        type = 'nome';
                                                    }
                                                }

                                                errMsg +=
                                                    client.tl({
                                                        local: int.lang + 'efd-fE',
                                                        cmd: [
                                                            embedsArray[local[0]].fields[local[1]].name.replace(
                                                                /:$/,
                                                                ''
                                                            ),
                                                            type,
                                                            maxSize
                                                        ]
                                                    }) + '\n';
                                            });

                                            int.editReply(client.tl({ local: int.lang + 'efd-fCE' }) + '\n' + errMsg);
                                        }
                                    }
                                });

                                return;
                            } else if (true /*beta.has(`${int.user.id}`)*/) {
                                if (secret) {
                                    return int.editReply(client.tl({ local: int.lang + 'efd-ephIRT' }));
                                }

                                var infoUIRT = await client.db.query(`select nomerpg from irt where id = :id`, {
                                    replacements: { id: int.user.id }
                                });
                                infoUIRT = infoUIRT[0];

                                if (infoUIRT.length >= 20) {
                                    return int.editReply(client.tl({ local: int.lang + 'efd-irtMF' }));
                                }

                                var reply = this.create(client, int, fichaUser);

                                await int.editReply({ embeds: reply }).then(async m => {
                                    const bDes = new client.Discord.ButtonBuilder()
                                        .setStyle(2)
                                        .setLabel(client.tl({ local: int.lang + 'bt-desIrt' }))
                                        .setCustomId(
                                            `buttonIrt|des|id:${int.user.id}|nomerpg:${nomerpg}|msgid:${m.id}|chid:${m.channel.id}`
                                        );

                                    const bApg = new client.Discord.ButtonBuilder()
                                        .setStyle(2)
                                        .setLabel(client.tl({ local: int.lang + 'bt-apgIrt' }))
                                        .setCustomId(
                                            `buttonIrt|apg|id:${int.user.id}|nomerpg:${nomerpg}|msgid:${m.id}|chid:${m.channel.id}`
                                        );

                                    m.edit({ components: [{ type: 1, components: [bDes, bApg] }] });

                                    var irtU = {
                                        id: int.user.id,
                                        nomerpg: nomerpg,
                                        msgid: m.id,
                                        chid: m.channel.id
                                    };

                                    await client.cache.updateIrt(
                                        irtU['id'],
                                        irtU['nomerpg'],
                                        irtU['msgid'],
                                        irtU['chid']
                                    );
                                    client.emit('irtStart', irtU);
                                });
                            } else {
                                //Só utilizado se o beta estiver ativado
                                return int.editReply(client.tl({ local: int.lang + 'efd-bF' }));
                            }
                        } catch (err) {
                            client.log.warn(err);
                            return int.editReply(client.tl({ local: int.lang + 'efd-mMG' }));
                        }
                    } else {
                        return int.editReply(client.tl({ local: int.lang + 'efd-nFE', nomerpg: nomerpg }));
                    }
                })

                .catch(err => client.log.error(err, true));
        });
    }
    create(client, int, fichaUser) {
        var reply = Object({
            inf: false,
            s1: false,
            s2: false,
            s3: false,
            desc: false
        });

        fichaUser = JSON.parse(JSON.stringify(fichaUser));

        const atributosI1Pt = client.resources['pt-'].atributosI1;
        const atributosI2Pt = client.resources['pt-'].atributosI2;
        const atributosStatusPt = client.resources['pt-'].atributosStatus;

        const { atributosI1, atributosIF1, atributosI2, atributosIF2, atributosStatus, atributosStatusF } =
            client.resources[int.lang];

        const infEmbed = new client.Discord.EmbedBuilder()
            .setColor(parseInt(process.env.EMBED_COLOR))
            .setTitle(
                client.tl({ local: int.lang + 'ef-infAuthor' }) +
                    fichaUser.nomerpg +
                    `. ${client.tl({ local: int.lang + 'created' })}${int.user.tag}`
            )
            .setAuthor({
                name: 'Clique aqui para visualizar esta ficha no site do Kami',
                url: `https://kamiapp.com.br/ficha/${fichaUser.id}/${fichaUser.nomerpg}`
            });
        if (fichaUser.atributos.imagem) {
            infEmbed.setThumbnail(fichaUser.atributos.imagem);
        }

        delete fichaUser.atributos['imagem'];

        const s1Embed = new client.Discord.EmbedBuilder().setColor(parseInt(process.env.EMBED_COLOR)),
            s2Embed = new client.Discord.EmbedBuilder().setColor(parseInt(process.env.EMBED_COLOR));
        const s3Embed = new client.Discord.EmbedBuilder().setColor(parseInt(process.env.EMBED_COLOR)),
            descEmbed = new client.Discord.EmbedBuilder().setColor(parseInt(process.env.EMBED_COLOR));

        for (var x of atributosI1) {
            if (fichaUser.atributos[atributosI1Pt[atributosI1.indexOf(x)]] != undefined) {
                infEmbed.addFields({
                    name: atributosIF1[atributosI1.indexOf(x)],
                    value: fichaUser.atributos[atributosI1Pt[atributosI1.indexOf(x)]],
                    inline: true
                });
                delete fichaUser.atributos[atributosI1Pt[atributosI1.indexOf(x)]];
            }
        }

        for (var x of atributosI2) {
            if (fichaUser.atributos[atributosI2Pt[atributosI2.indexOf(x)]] != undefined) {
                infEmbed.addFields({
                    name: atributosIF2[atributosI2.indexOf(x)],
                    value: fichaUser.atributos[atributosI2Pt[atributosI2.indexOf(x)]],
                    inline: false
                });
                delete fichaUser.atributos[atributosI2Pt[atributosI2.indexOf(x)]];
            }
        }

        var fields = 0;
        for (var x of atributosStatus) {
            if (fichaUser.atributos[atributosStatusPt[atributosStatus.indexOf(x)]] != undefined) {
                if (fields <= 25) {
                    s1Embed.addFields({
                        name: atributosStatusF[atributosStatus.indexOf(x)],
                        value: fichaUser.atributos[atributosStatusPt[atributosStatus.indexOf(x)]],
                        inline: true
                    });
                } else if (fields > 25 && fields <= 50) {
                    s2Embed.addFields({
                        name: atributosStatusF[atributosStatus.indexOf(x)],
                        value: fichaUser.atributos[atributosStatusPt[atributosStatus.indexOf(x)]],
                        inline: true
                    });
                } else if (fields > 50 && fields <= 75) {
                    s3Embed.addFields({
                        name: atributosStatusF[atributosStatus.indexOf(x)],
                        value: fichaUser.atributos[atributosStatusPt[atributosStatus.indexOf(x)]],
                        inline: true
                    });
                }

                delete fichaUser.atributos[atributosStatusPt[atributosStatus.indexOf(x)]];
                fields += 1;
            }
        }

        if (fichaUser.atributos.descricao != undefined) {
            if (fichaUser.atributos.descricao != '') {
                descEmbed.setDescription(fichaUser.atributos.descricao);
                delete fichaUser.atributos.descricao;
            }
        }

        for (var x of Object.keys(fichaUser.atributos)) {
            if (fichaUser.atributos[x] != undefined) {
                if (fields < 25) {
                    s1Embed.addFields({ name: x, value: fichaUser.atributos[x], inline: true });
                } else if (fields >= 25 && fields < 50) {
                    s2Embed.addFields({ name: x, value: fichaUser.atributos[x], inline: true });
                } else if (fields >= 50 && fields < 75) {
                    s3Embed.addFields({ name: x, value: fichaUser.atributos[x], inline: true });
                }

                delete fichaUser.atributos[x];
                fields += 1;
            }
        }

        reply.inf = infEmbed;
        if (s1Embed.data.fields) {
            reply.s1 =
                s1Embed.data.fields.length > 0 ? s1Embed.setTitle(client.tl({ local: int.lang + 'ef-stpTi' })) : false;
        }
        if (s2Embed.data.fields) {
            reply.s2 =
                s2Embed.data.fields.length > 0 ? s2Embed.setTitle(client.tl({ local: int.lang + 'ef-stpTi' })) : false;
        }
        if (s3Embed.data.fields) {
            reply.s3 =
                s3Embed.data.fields.length > 0 ? s3Embed.setTitle(client.tl({ local: int.lang + 'ef-stpTi' })) : false;
        }
        reply.desc = descEmbed.data.description
            ? descEmbed.setTitle(client.tl({ local: int.lang + 'ef-descPerso' }))
            : false;

        const replyArray = new Array();
        Object.values(reply).forEach(val => {
            if (val) {
                replyArray.push(val);
            }
        });
        reply = replyArray;

        return reply;
    }
    autocomplete(client, int) {
        const options = int.options._hoistedOptions;

        options.forEach(async opt => {
            if (opt.name == 'sheet_name' && opt.focused) {
                const fichasUser = await client.cache.getFichasUser(int.user.id);

                if (fichasUser.length >= 1) {
                    const find = client.utils.matchNomeFicha(opt.value, fichasUser);
                    const data = new Array();

                    find.forEach(f => {
                        data.push({ name: f, value: f });
                    });

                    int.respond(data);
                }
            }
        });
    }
};
