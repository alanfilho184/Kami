import { Interaction } from '../resources/utils/interaction-handler';
import commands from '../commands';

export default {
    name: 'roll-again',
    ownerOnly: false,
    type: 'bot',
    run: async (int: Interaction, language: Available_Languages) => {
        commands.get('roll')!.run(int, language);
    }
};
