import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { DateTime } from 'luxon';
import rest from '../../configs/rest';
import { ButtonStyle, Routes } from 'discord-api-types/v10';

export default {
    ownerOnly: false,
    commandNames: {
        pt_br: 'suporte',
        en_us: 'support'
    },
    fullNames: {
        pt_br: 'Suporte',
        en_us: 'Support'
    },
    descriptions: {
        pt_br: 'Envia uma mensagem para o suporte do Kami.',
        en_us: 'Sends a message to Kami support.'
    },
    arguments: {
        pt_br: [
            {
                name: 'mensagem',
                description: 'A mensagem que você deseja enviar para o suporte.',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ],
        en_us: [
            {
                name: 'message',
                description: 'The message you want to send to support.',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ]
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        const message = int.getArgs().get('message').value;

        const supportEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${int.user.preferred_nick} | ${int.user.id}`,
                iconURL: int.user.avatar
                    ? `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`
                    : undefined
            })
            .setTitle('Mensagem recebida')
            .setDescription(message)
            .setColor(parseInt(config.EMBED_COLOR))
            .setFooter({
                text:
                    'Mensagem recebida em: ' +
                    DateTime.now().setZone('America/Fortaleza').toFormat('dd/MM/y | HH:mm:ss ') +
                    '(GMT -3)'
            });

        const res = (await rest.post(Routes.channelMessages(`${config.LOG_CHANNEL_ID.channel_id}`), {
            body: { embeds: [supportEmbed.toJSON()], content: `<@${config.OWNER_ID.discord_id}>` },
            headers: { 'Content-Type': 'application/json' }
        })) as { id: string };

        await rest.put(Routes.channelPin(config.LOG_CHANNEL_ID.channel_id, res.id));


        const supportButton = new ButtonBuilder()
            .setLabel(localization(language, 'support|support-button'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://kamiapp.com.br/suporte');

        return int.reply({
            content: localization(language, 'support|message-sent'),
            components: [{ type: 1, components: [supportButton.toJSON()] }]
        });
    }
};
