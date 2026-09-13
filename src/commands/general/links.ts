import { EmbedBuilder, ButtonBuilder } from '@discordjs/builders';
import { Interaction } from '../../resources/utils/interaction-handler';
import { localization } from '../../resources/localization';
import config from '../../configs/config';
import { ButtonStyle } from 'discord-api-types/v10';
import { Command_Category } from '../../types/enums';

export default {
    ownerOnly: false,
    commandNames: {
        'pt-br': 'links',
        'en-us': 'links'
    },
    fullNames: {
        'pt-br': 'Links',
        'en-us': 'Links'
    },
    descriptions: {
        'pt-br': 'Envia os links relacionados ao Kami.',
        'en-us': 'Sends the links related to Kami.'
    },
    type: 1,
    category: Command_Category.GENERAL,
    run: async (int: Interaction, language: Available_Languages) => {
        const linksEmbed = new EmbedBuilder()
            .setTitle(localization(language, 'links|title'))
            .setDescription(localization(language, 'links|description'))
            .setColor(parseInt(config.EMBED_COLOR))
            .setTimestamp(Date.now())
            .setFooter({
                text: localization(language, 'embed|footer', [
                    { replace: '$version$', value: config.VERSION },
                    { replace: '$year$', value: new Date().getFullYear().toString() }
                ])
            });

        const websiteButton = new ButtonBuilder()
            .setLabel(localization(language, 'links|website-button'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://kamiapp.com.br');

        const inviteButton = new ButtonBuilder()
            .setLabel(localization(language, 'links|invite-button'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://kamiapp.com.br/convite');

        const supportButton = new ButtonBuilder()
            .setLabel(localization(language, 'links|support-button'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://kamiapp.com.br/suporte');

        const usageTermsButton = new ButtonBuilder()
            .setLabel(localization(language, 'links|terms-button'))
            .setStyle(ButtonStyle.Link);

        if (language == 'pt-br') {
            usageTermsButton.setURL('https://kamiapp.com.br/termos');
        } else {
            usageTermsButton.setURL('https://kamiapp.com.br/terms');
        }

        const privacyPolicyButton = new ButtonBuilder()
            .setLabel(localization(language, 'links|privacy-button'))
            .setStyle(ButtonStyle.Link);

        if (language == 'pt-br') {
            privacyPolicyButton.setURL('https://kamiapp.com.br/privacidade');
        } else {
            privacyPolicyButton.setURL('https://kamiapp.com.br/privacy');
        }

        await int.reply({
            embeds: [linksEmbed],
            components: [
                {
                    type: 1,
                    components: [websiteButton, inviteButton, supportButton, usageTermsButton, privacyPolicyButton]
                }
            ]
        });
    }
};
