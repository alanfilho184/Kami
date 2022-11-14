require("colors")
require("./src/resources/scripts/logs")
require('dotenv').config()

const Client = require('./src/client')
const client = new Client()
client.login()