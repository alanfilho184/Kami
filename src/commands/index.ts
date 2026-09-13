import { globSync } from 'glob';
import path from 'node:path';

const commands: Map<string, Command> = new Map();

const commandsDir = path.resolve(__dirname).replace(/\\/g, '/');
const commandFiles = globSync(`${commandsDir}/**/*.{js,ts}`);

for (const file of commandFiles) {
    const normalizedFile = file.replace(/\\/g, '/');
    if (normalizedFile.endsWith('.d.ts') || /\/index\.(js|ts)$/.test(normalizedFile)) {
        continue;
    }

    const relativePath = path.posix.relative(commandsDir, normalizedFile);
    const command: Command = require(`./${relativePath}`).default;

    if (command) {
        commands.set(command.commandNames['en-us'], command);
    }
}

export default commands;
