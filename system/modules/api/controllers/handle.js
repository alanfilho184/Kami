const glob = require('fast-glob');

module.exports = class handleControllers {
    constructor(client) {
        var controllers = glob.sync(["**/controllers/**/*.controller.js", "!node_modules", "!commands", "!events"],)

        const paths = new Array();
        const routers = new Array();

        controllers.forEach(c => {
            const _controller = require(process.cwd() + "/" + c)
            const controller = new _controller(client)

            paths.push(controller.path);
            routers.push(controller.router);
        })

        return {
            paths,
            routers
        }
    }
}
