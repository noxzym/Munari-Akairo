const { Listener } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class Cooldown extends Listener {
    constructor() {
        super("cooldown", {
            event: "cooldown",
            emitter: "commandHandler",
            category: "commandHandler"
        })
    };
    async exec(message, command, remaining) {
        return message.inlineReply(createEmbed("error", `Oof! you hit the cooldown. Please wait **\`${await this.client.util.parseMs(remaining)}\`** to use this command again`)).then(x => { x.delete({ timeout: 10000 }) });
    };
};