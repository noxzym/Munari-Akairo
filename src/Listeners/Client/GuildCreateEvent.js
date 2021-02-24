const { Listener } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class GuildCreateEvent extends Listener {
    constructor() {
        super("GuildCreateEvent", {
            emitter: "client",
            event: "guildCreate",
            category: "client",
        })
    }
    async exec(guild) {
        const sname = await this.client.util.firstUppercase(guild.name)
        const sreg = await this.client.util.firstUppercase(guild.region)
        const membert = guild.members.cache.size;
        const memberbot = guild.members.cache.filter(x => x.user.bot).size;
        const memberuser = guild.members.cache.filter(x => !x.user.bot).size;
        const owner = guild.owner.user;

        let e = createEmbed("info")
            .setAuthor(`I Joined new Server`)
            .setDescription(
                `**Server Information\n` +
                `\`\`\`asciidoc\n` +
                `Server Name   :: ${sname} | ${guild.id}\n` +
                `Server Owner  :: ${owner.tag} | ${owner.id}\n` +
                `Server region :: ${sreg}\n` +
                `Member Count  :: ${membert} Member\n` +
                `              :: ${memberuser} User\n` +
                `              :: ${memberbot} Bot\n` +
                `\`\`\`**`
            );
        let channel = this.client.channels.cache.get('773487078654345226');
        channel.send(e)
    }
};