const { MessageEmbed } = require('discord.js');
const color = {
    spotify: "#18d869",
    yt: "#ff0000",
    listen: "#1d1f2b",
    info: "#03fcfc",
    warn: "#FFFF00",
    error: "#FF0000"
}

const createEmbed = (type, message) => {
    const embed = new MessageEmbed()
        .setColor(color[type])
    if (message) embed.setDescription(message)
    return embed
};

module.exports = {
    createEmbed
}