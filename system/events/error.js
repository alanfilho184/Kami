module.exports = {
    name: "error",
    type: "djs",
    execute: async (client, error) => {
        client.log.error(error, true)
    }
}