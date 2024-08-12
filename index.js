require("colors")
require("./src/resources/scripts/logs")
require('dotenv').config()
const { ShardingManager } = require('discord.js')

// const Client = require('./src/client')
// const client = new Client()
// client.login()

const manager = new ShardingManager('./src/client.js', { token: process.env.TOKEN, totalShards: 2, mode: 'worker' });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();