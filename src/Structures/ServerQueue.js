module.exports = class ServerQueue {
    constructor(TextChannel, VoiceChannel) {
        this.textChannel = TextChannel;
        this.voiceChannel = VoiceChannel;
        this.guild = TextChannel.guild;
        this.songs = [];
        this.volume = 100;
        this.player = null
        this._repeat = 0;
        this._playing = true;
        this._lastMusicMessageID = null;
    }
}