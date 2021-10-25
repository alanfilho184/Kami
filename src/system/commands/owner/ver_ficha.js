// Em Desenvolvimento 

module.exports = class ver_ficha {
    constructor() {
        return {
            perm: {
                bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                user: [],
                owner: true,
            },
            name: "verficha",
            cat: "viewsheet",
            catEn: "View sheet",
            desc: 'Visualiza uma ficha de outro usuário.',
            descEn: 'View another user sheet\`s',
            aliases: ["vf", "vs", "ver", "view"],
            helpPt: {
                title: "<:dadosAjuda:766790214030852137> " + "$prefix$" + "sucesso", desc: `
            Este comando serve para calcular o sucesso do seu dado baseado nas regras do sistema **Call of Cthulhu**
        
        _Formato do comando:_
        **${"$prefix$"}sucesso <valor>**
        
        Ex: **${"$prefix$"}sucesso 55**`
            },

            helpEn: {
                title: "<:dadosAjuda:766790214030852137> " + "$prefix$" + "sucess", desc: `
            This command is used to calculate the success of your dice based on the rules of system **Call of Cthulhu**
        
        _Format of the command:_
        **${"$prefix$"}sucess <value>**
        
        Ex: ${"$prefix$"}sucess 55`
            },
            run: this.execute
        }
    }
    execute(client, msg) {
        const args = client.utils.args(msg)

        if(msg.channel.type != "DM"){
            
        }

    }
}