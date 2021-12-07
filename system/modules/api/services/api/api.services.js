const pass = new Object()

module.exports = class apiServices {
    constructor(client) {
        pass.client = client
    }

    log(info) {
        if (info.format == "msg") {
            if (info.type == "info") {
                pass.client.log.info(info.msg)
            }
            else if (info.type == "error") {
                pass.client.log.error(info.msg, info.ping)
            }
            else if (info.type == "warn") {
                pass.client.log.warn(info.msg, info.ping)
            }
        }
        else if (info.format == "embed") {
            pass.client.log.embed(info.embed, info.ping)
        }
    }
}