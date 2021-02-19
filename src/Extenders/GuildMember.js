const { Structures } = require("discord.js");
Structures.extend("GuildMember", GuildMember => {
    return class MunariGuildMember extends GuildMember {
        constructor(client, data, guild) {
            super(client, data, guild);
        }
    };
});