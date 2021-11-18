var pass = new Object()

module.exports = class apiServices {
    constructor(client) {
        pass.client = client
    }

    getBotinfo() {
        return pass.client.botStatus.api()
    }

    getCommands() {
        const comandos = new Object()

        pass.client.commands.map(c => {
            if (!c.perm.owner) {
                comandos[c.name] = {
                    name: c.name,
                    description: c.desc,
                    cat: c.cat,
                    help: c.helpPt,
                }
            }
        })

        return comandos
    }
}