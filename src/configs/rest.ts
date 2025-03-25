import { REST } from '@discordjs/rest';
import config from './config';

const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

export default rest;