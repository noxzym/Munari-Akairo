const { Listener } = require("discord-akairo");

module.exports = class MissingPermissions extends Listener {
    constructor() {
        super("missingPermissions", {
            event: "missingPermissions",
            emitter: "commandHandler",
            category: "commandHandler"
        })
    }
    async exec(message, command, type, missing) {
        if (missing.includes("SEND_MESSAGES")) return;
        if (type === "client") {
            type = this.client.user.username
        } else {
            type = message.author.username
        }
        return message.channel.send(`**<a:decline:776412779899781141> | Access Denied. \nMissing Permission for ${type}: \`[${missing}]\`**`).then(x => { x.delete({ timeout: 10000 }) });
    }
};