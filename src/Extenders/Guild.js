const { Structures } = require("discord.js");
Structures.extend("Guild", Guild => {
    return class QueueManager extends Guild {
        constructor(client, data) {
            super(client, data)
            this.queue = null
        };
    }
});