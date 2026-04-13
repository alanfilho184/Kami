import { Interaction } from '../resources/utils/interaction-handler';
import commands from '../commands';
import { Command_Category } from '../types/enums';

export default {
    name: 'roll-again',
    ownerOnly: false,
    type: 'bot',
    category: Command_Category.ROLL,
    run: async (int: Interaction, language: Available_Languages) => {
        commands.get('roll')!.run(int, language);
    }
};
