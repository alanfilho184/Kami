module.exports = class buttonRestart {
    constructor() {
        return {
            name: "btRestart",
            run: this.execute
        }
    }

    execute(client, comp) {
        comp.deferUpdate()
            .then(() => {
                if (comp.user.id == client.settings.owner) {
                    process.emit("SIGTERM")
                }
                else {
                    comp.followUp({ content: "Somente pessoal autorizado pode utilizar esta função", ephemeral: true })
                }
            })
    }
}