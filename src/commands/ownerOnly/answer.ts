import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { DateTime } from 'luxon';
import rest from '../../configs/rest';
import { ButtonStyle, Routes } from 'discord-api-types/v10';

export default {
    ownerOnly: true,
    commandNames: {
        pt_br: 'responder',
        en_us: 'answer'
    },
    fullNames: {
        pt_br: 'Responder',
        en_us: 'Answer'
    },
    descriptions: {
        pt_br: 'Responde um usuário que enviou uma mensagem para o suporte do Kami.',
        en_us: 'Responds to a user who sent a message to Kami support.'
    },
    arguments: {
        pt_br: [
            {
                name: 'user_id',
                description: 'O ID do usuário que você deseja responder.',
                type: 'STRING',
                required: true,
                autocomplete: false
            },
            {
                name: 'mensagem',
                description: 'A mensagem que você deseja enviar para o usuário.',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ],
        en_us: [
            {
                name: 'user_id',
                description: 'The ID of the user you want to respond to.',
                type: 'STRING',
                required: true,
                autocomplete: false
            },
            {
                name: 'message',
                description: 'The message you want to send to the user.',
                type: 'STRING',
                required: true,
                autocomplete: false
            }
        ]
    },
    type: 1,
    run: async (int: Interaction, language: Available_Languages) => {
        const targetUserId = int.getArgs().get('user_id')?.value || int.user.id;
        const message = int.getArgs().get('message').value;

        const supportEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${int.user.preferred_nick}`,
                iconURL: int.user.avatar
                    ? `https://cdn.discordapp.com/avatars/${int.user.id}/${int.user.avatar}.png`
                    : undefined
            })
            .setDescription(message)
            .setColor(parseInt(config.EMBED_COLOR))
            .setTimestamp(Date.now())
            .setFooter({
                text: localization(language, 'embed|footer', [
                    { replace: '$version$', value: config.VERSION },
                    { replace: '$year$', value: new Date().getFullYear().toString() }
                ])
            });

        const supportButton = new ButtonBuilder()
            .setLabel(localization(language, 'support|support-button'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://kamiapp.com.br/suporte');

        await rest
            .post(`/users/@me/channels`, {
                body: { recipient_id: targetUserId },
                headers: { 'Content-Type': 'application/json' }
            })
            .then(async res => {
                const dmChannelId = (res as { id: string }).id;
                await rest.post(Routes.channelMessages(dmChannelId), {
                    body: {
                        content: localization(language, 'answer|warning'),
                        embeds: [supportEmbed.toJSON()],
                        components: [{ type: 1, components: [supportButton.toJSON()] }]
                    },
                    headers: { 'Content-Type': 'application/json' }
                });
            });

        return int.reply({
            content: localization(language, 'answer|message-sent')
        });
    }
};
