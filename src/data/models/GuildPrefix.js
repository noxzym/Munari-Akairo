const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    settings: {
        type: Object,
        require: true
    }
}, { minimize: false });

module.exports = model('GuildPrefix', guildSchema);