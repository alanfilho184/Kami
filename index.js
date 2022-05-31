require("colors")
require("./system/resources/scripts/logs")
require('dotenv').config()

const Client = require('./system/modules/Client')
const options = require('./settings')
const args = new Array()

process.argv.forEach(function (arg) {
    if (arg.startsWith('--')) {
        args.push(arg.substring(2))
    }
});

if (args.includes('full')) {
    options.full = true
    const client = new Client(options)
    client.login()
}
else if (args.includes('api')) {
    options.api = true
    new Client(options)
}
else if (args.includes('bot')) {
    options.bot = true
    const client = new Client(options)
    client.login()
}
else {
    options.full = true
    const client = new Client(options)
    client.login()
}
