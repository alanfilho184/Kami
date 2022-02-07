module.exports = class msg_handler {
    constructor(options = {}) {
        this.options = options
        this.client = options.client
    }

    tl(args) {
        try {
            const local = args.local.split("-")

            var msg = require("./msgs.json")[local[0]][local[1]][local[2]]

            Object.keys(args).forEach(k => {
                if (k != "local") {
                    try { msg = msg.replace(`$${k}$`, args[k]) }
                    catch (err) { }
                }
            });
        }
        catch (err) {
            this.log.error(err, true)
            this.log.warn(args, true)
            throw new Error(`Erro ao carregar a mensagem ${local[0]}-${local[1]}-${local[2]}`)
        }

        if (msg == undefined) {
            this.log.error(`Mensagem ${local[0]}-${local[1]}-${local[2]} indefinida`, true)
            throw new Error(`Mensagem ${local[0]}-${local[1]}-${local[2]} indefinida`)
        }
        else if (msg.match(/(\$[A-z]+\$)/gim)) {
            this.log.error(`Mensagem ${local[0]}-${local[1]}-${local[2]} com args não substituidos`, true)
            return msg
        }
        else {
            return msg
        }
    }

}
