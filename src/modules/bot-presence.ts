import { Client, ActivityType, Events } from 'discord.js';

import config from '../configs/config';

const client = new Client({
    intents: []
});

client.once(Events.ClientReady, client => {
    console.log(`Presence Gateway conectado como ${client.user.tag}`);

    client.user.setPresence({
        status: 'online',
        activities: [
            {
                name: `v${config.VERSION}`,
                type: ActivityType.Playing
            }
        ]
    });
});

client.on(Events.Error, error => {
    console.error('Discord Gateway error:', error);
});

client.login(config.BOT_TOKEN);
