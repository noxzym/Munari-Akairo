const { Schema, model } = require('mongoose');

module.exports = model("GuildPrefix", new Schema({
      id: {
          type: String,
          required: true
      },
      settings: {
          type: Object,
          require: true
      }
  }, { minimize: false })
)