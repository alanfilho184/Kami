import { Interaction } from '../resources/utils/interaction-handler';
import commands from '../commands';
import { Command_Category } from '../types/enums';

export default {
    name: 'buttonRoll', // Cannot be button-roll to be compatible with Kami@v4 components
    ownerOnly: false,
    type: 'bot',
    category: Command_Category.ROLL,
    run: async (int: Interaction, language: Available_Languages) => {
        commands.get('roll')!.run(int, language);
    }
};
