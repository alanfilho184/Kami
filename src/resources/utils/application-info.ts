import rest from '../../configs/rest';
import { Routes, Snowflake } from 'discord-api-types/v10';

let applicationInfo: {
    approximate_guild_count: number;
    bot: {
        id: Snowflake;
        username: string;
        discriminator: string;
        avatar: string;
        public_flags: number;
        flags: number;
        bot: boolean;
        banner: string;
        accent_color: number;
        global_name: string;
        avatar_decoration_data: string;
        banner_color: string;
        clan: string;
    };
};

async function getApplicationInfo() {
    const applicationInfo = await rest.get(Routes.currentApplication(), {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });

    return applicationInfo;
}

getApplicationInfo().then(info => {
    // @ts-ignore
    applicationInfo = info;
});

setInterval(async () => {
    // @ts-ignore
    applicationInfo = await getApplicationInfo();
}, 1000 * 60 * 60 * 12);

export { applicationInfo };
