import config from '../configs/config';
import {
    ActivityOptions,
    ActivityType,
    Client,
    ClientPresence,
    LimitedCollection,
    PresenceData,
    PresenceStatusData,
    Routes
} from 'discord.js';
import rest from '../configs/rest';

class BotPresence {
    private client!: Client;

    constructor(
        presence: PresenceData = {
            status: 'online',
            activities: [
                {
                    name: `v${config.VERSION}`,
                    type: ActivityType.Playing
                }
            ]
        }
    ) {
        rest.get(Routes.gatewayBot()).then(gateway => {
            this.client = new Client({
                intents: [],
                // makeCache: () => new LimitedCollection({ maxSize: 0 }),
                //@ts-ignore
                shardCount: Number(gateway.shards),
                presence
            });

            this.client.login(config.BOT_TOKEN);
        });
    }

    private readyUser() {
        if (!this.client.user) {
            throw new Error('Cliente ainda não está pronto: aguarde o evento "clientReady" antes de setar a presença.');
        }
        return this.client.user;
    }

    setPresence(presence: PresenceData): ClientPresence {
        return this.readyUser().setPresence(presence);
    }

    setStatus(status: PresenceStatusData): ClientPresence {
        return this.readyUser().setStatus(status);
    }

    setActivity(name: string | ActivityOptions, options?: Omit<ActivityOptions, 'name'>): ClientPresence {
        const user = this.readyUser();
        return typeof name === 'string' ? user.setActivity(name, options) : user.setActivity(name);
    }

    setAFK(afk = true): ClientPresence {
        return this.readyUser().setAFK(afk);
    }

    destroy(): Promise<void> {
        return this.client.destroy();
    }
}

const botPresence = new BotPresence();

export default botPresence;
