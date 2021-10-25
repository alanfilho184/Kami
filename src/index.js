require("colors")
require("./system/resources/scripts/logs")
require('dotenv').config()

const Client = require('./system/modules/Client')
const options = require('./settings')

const client = new Client(options)

client.login()