module.exports = class controller {
    constructor(client) {
        const _apiController = require('./api/api.controller');
        const apiController = new _apiController(client)

        return {
            paths: [apiController.path],
            router: [apiController.router]
        }
    }
}