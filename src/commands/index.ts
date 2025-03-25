import { globSync } from 'glob';

const commands: Map<string, Command> = new Map();

let commandFiles = globSync('dist/commands/**/*.js');
commandFiles = commandFiles.filter(file => {
    return file.search('index') === -1;
});

for (const file of commandFiles) {
    const command: Command = require(`./${file.replace('dist\\commands', '')}`).default;

    if (command) {
        commands.set(command.commandNames.en_us, command);
    }
}

export default commands;
