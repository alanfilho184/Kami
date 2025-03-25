import express from 'express';
import middlewares from './middlewares';
import routes from './routes';
import config from './configs/config';
import { sendStartupWebhook } from './logs/discord-logger';
import sheetNameCache from './resources/cache/sheet-name.cache';

const app = express();

async function startup() {
    await sheetNameCache.loadCache();

    app.use(express.raw({ type: '*/*' }));
    app.use(middlewares);
    app.use(routes);

    app.listen(config.PORT, () => {
        console.log(`Server is running on port ${config.PORT}`);
        sendStartupWebhook();
    });
}

startup();
