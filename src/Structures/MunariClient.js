
require('dotenv').config();
require('../Extenders/InlineReply');
require('../Extenders/GuildMember');
require("../Extenders/Guild");

const { AkairoClient, CommandHandler, ListenerHandler, MongooseProvider } = require("discord-akairo");
const { Api } = require('@top-gg/sdk')
const PlayerHandler = require('../Utils/PlayerHandler');
const UtilHandler = require('../Utils/UtilHandler');
const ShoukakuHandler = require("../Utils/ShoukakuHandler");
const mongoose = require("mongoose");
const model = require("../data/models/GuildPrefix");
const path = require("path");

module.exports = class MunariClient extends AkairoClient {
    constructor(config) {
        super(
            {
                ownerID: "243728573624614912",
            }, {
                disableMentions: "everyone",
                allowedMentions: {
                    parse: []
                },
                messageCacheMaxSize: Infinity,
                messageCacheLifetime: 540,
                messageSweepInterval: 180,
                restTimeOffset: 0,
                ws: {
                    intents: [
                        "GUILDS",
                        "GUILD_BANS",
                        "GUILD_EMOJIS",
                        "GUILD_VOICE_STATES",
                        "GUILD_PRESENCES",
                        "GUILD_MESSAGES",
                        "GUILD_MESSAGE_REACTIONS",
                        "GUILD_MESSAGE_TYPING"
                    ]
                }
            }
        );
        this.commandHandler = new CommandHandler(this, {
            prefix: (message) => {
                if (message.guild) {
                    return this.settings.get(message.guild.id, "prefix", "m!")
                }
                return "m!";
            },
            allowMention: true,
            blockClient: true,
            blockBots: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e4,
            defaultCooldown: 10000,
            directory: path.join(__dirname, "..", "Commands"),
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, "..", "Listeners")
        });
        this.shoukaku = new ShoukakuHandler(this);
        this.player = new PlayerHandler(this);
        this.util = new UtilHandler(this);
        this.settings = new MongooseProvider(model);
        this.dbl = new Api('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDk5OTc3fQ.0S6h9gpQg77c0mLRqLC4vc4zgduENIBrPlXzkRtDF24');
        this.config = config;
        this.snipes = new Map();
    }
    async start() {
        mongoose.connect("mongodb+srv://DexX:M0zila440@muridb.3gy8x.mongodb.net/database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        this._EventManager();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        })
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();

        return super.login("NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.tSkdflj2vTo5eOYWgAW4Hm6RltQ")
        // return super.login('NzkxMjcxMjIzMDc3MTA5ODIw.X-MuwA.XTpdWsnWaAt3Qm7qGqkQr7zL3cM')
    }
    async _EventManager() {
        await this.settings.init();
        this.shoukaku.manager.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`));
        this.shoukaku.manager.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error));
        this.shoukaku.manager.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason ? reason : 'No reason'}`));
        this.shoukaku.manager.on('disconnected', (name, reason) => console.warn(`Lavalink ${name}: Disconnected, Reason ${reason ? reason : 'No reason'}`));
    }
    async totalGuilds() {
        return this.shard.broadcastEval("this.guilds.cache.size").then(x => x.reduce((a, b) => a + b), 0)
    }
    async totalChannels() {
        return this.shard.broadcastEval("this.channels.cache.size").then(x => x.reduce((a, b) => a + b), 0)
    }
    async totalUsers() {
        return this.shard.broadcastEval("this.users.cache.size").then(x => x.reduce((a, b) => a + b), 0)
    }
    async totalPlaying() {
        return this.shard.broadcastEval("this.guilds.cache.filter(g => g.queue !== null && g.queue.playing === true).size").then(x => x.reduce((a, b) => a + b))
    }
    async totalMemory(type) {
        return this.shard.broadcastEval(`process.memoryUsage()["${type}"]`).then(x => x.reduce((a, b) => a + b))
    }
}