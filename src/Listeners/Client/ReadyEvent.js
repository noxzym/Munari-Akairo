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
        console.log("Amjay Mabar, SKUUYYY");

        setInterval(() => {
            const status = [
                `• Mention me for know my prefix •`,
                `• Ready to ${this.client.guilds.cache.size} Servers •`,
                `• With ${this.client.users.cache.size} Users •`,
            ];
            const type = [
                "PLAYING",
                "WATCHING",
                "LISTENING"
            ]
            let random = Math.floor(Math.random() * status.length)
            let randomtp = Math.floor(Math.random() * type.length)
            this.client.user.setActivity(status[random], { type: type[randomtp] });
        }, 60 * 1000 * 30);
    }
}