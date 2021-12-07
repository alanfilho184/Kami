const glob = require('fast-glob');

module.exports = class startServices {
    constructor(client) {
        var services = glob.sync(["**/services/**/*.services.js", "!node_modules", "!commands", "!events"],)

        services.forEach(s => {
            const service = require(process.cwd()+"/"+s)
            new service(client) 
        })
    }
}
