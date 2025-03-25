import { Interaction } from '../resources/utils/interaction-handler';
import commands from '../commands';

export default {
    name: 'buttonRoll', // Cannot be button-roll to be compatible with v4 components
    ownerOnly: false,
    type: 'bot',
    run: async (int: Interaction, language: Available_Languages) => {
        commands.get('roll')!.run(int, language);
    }
};
