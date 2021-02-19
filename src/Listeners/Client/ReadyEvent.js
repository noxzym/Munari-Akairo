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
                `• Ready to ${client.guilds.cache.size} Servers •`,
                `• With ${client.users.cache.size} Users •`,
            ];
            const type = [
                "PLAYING",
                "WATCHING",
                "LISTENING"
            ]
            let random = Math.floor(Math.random() * status.length)
            let randomtp = Math.floor(Math.random() * type.length)
            client.user.setActivity(status[random], { type: type[randomtp] });
        }, 60 * 1000 * 30);
    }
}