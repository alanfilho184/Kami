module.exports = class buttonRoll {
    constructor(){
        return {
            name: "buttonRoll",
            run: this.execute
        }
    }

    execute(client, comp){
        comp.deferUpdate()
        .then(() => {
            const rollInfo = comp.customId.split("|")[1]

            client.commands.get("buttonroll").roll(client, comp, rollInfo)
            client.emit("button", comp, "buttonRoll")
            try { client.utils.askForm(comp) }
            catch (err) { console.log(err) }
        })
    }
}