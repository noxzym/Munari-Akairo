const { Listener } = require("discord-akairo");

module.exports = class ReadyEvent extends Listener {
    constructor() {
        super("ReadyEvent", {
            emitter: "client",
            event: "ready",
            category: "client"
        })
    }
    exec() {
        console.log(`${this.client.user.tag} Ready`);
        this.client.user.setActivity("Beta tester for akairo framework", { type: "WATCHING", status: "idle" })
    }
}