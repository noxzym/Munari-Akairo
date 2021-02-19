const { Command } = require("discord-akairo");

module.exports = class x extends Command {
    constructor() {
        super("x", {
            aliases: [""],
            category: "",
            description: {
                content: "",
                usage: ""
            },
            args: [
                {
                    id: null,
                    match: null
                }
            ],
            cooldown: null,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: null,
            userPermissions: null,
        })
    };
    async exec(message) {

    };
};

const { Listener } = require("discord-akairo");

module.exports = class x extends Listener {
    constructor() {
        super("x", {
            emitter: "",
            event: "",
            category: "",
        })
    };
    async exec() {
        
    }
};