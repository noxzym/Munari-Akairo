const { Listener } = require("discord-akairo");
const moment = require('moment')
moment.locale()

module.exports = class MessageDeleteEvent extends Listener {
    constructor() {
        super("MessageDeleteEvent", {
            emitter: "client",
            event: "messageDelete",
            category: "client"
        })
    }
    async exec(message) {
        if (message.author.bot || message.channel.type === 'dm') return;

        const snipes = this.client.snipes.get(message.channel.id) || [];
        snipes.unshift({
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            date: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
        });
        snipes.splice(5);
        this.client.snipes.set(message.channel.id, snipes);
    }
}