const { Listener } = require("discord-akairo");

module.exports = class CommandStarted extends Listener {
    constructor() {
        super("commandStarted", {
            event: "commandStarted",
            emitter: "commandHandler",
            category: "commandHandler"
        })
    }
    async exec(message, command) {
        console.log(`${message.author.tag} •> ${command.id} <•> ${message.guild.name} <•> #${message.channel.name}`)
    }
};