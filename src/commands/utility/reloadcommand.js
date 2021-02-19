const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class ReloadCommand extends Command {
    constructor() {
        super("ReloadCommand", {
            aliases: ["reload"],
            category: "\`🛠️\`| Utility",
            description: {
                content: "Update change without restart",
                usage: "reload"
            },
            cooldown: null,
            channel: "guild",
            ownerOnly: true,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    };
    async exec(message) {
        var send = await message.channel.send(createEmbed("info", `<a:loading:804201332243955734> | Realoading command...`))
        try {
            await this.client.commandHandler.reloadAll();
            await this.client.listenerHandler.reloadAll();
            return send.edit(createEmbed("spotify", `Operation Success!. Reload all command Successful!`)).then(x => { x.delete({ timeout: 10000 }) });
        } catch (e) {
            console.log(e);
            send.edit(createEmbed("error", `Operation Failed. Because: \n\`\`\`js${e.stack}\`\`\``)).then(x => { x.delete({ timeout: 10000 }) });
        }
    };
}