const logs = require('../../resources/scripts/logs.js');

module.exports = {
    name: 'ready',
    type: 'djs',
    execute: async client => {
        await logs.startup(client);
        client.log.start(`Iniciada Shard ${client.shard.ids[0]}`, true);
        client.emit('activity', 'start');
    }
};
