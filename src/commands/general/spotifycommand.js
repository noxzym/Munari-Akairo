const { Command } = require("discord-akairo");
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { createEmbed } = require("../../utils/createEmbed");
const colorThief = require("colorthief")
const onecolor = require('onecolor');
const convert = require('parse-ms');
const path = require('path');

module.exports = class SpotifyCommand extends Command {
    constructor() {
        super("SpotifyCommand", {
            aliases: ["spotify", "sp"],
            category: "\`🎭\`| General",
            description: {
                content: "Display spotify information currently playing",
                usage: "spotify [user]"
            },
            args: [
                {
                    id: "user",
                    match: "content"
                },
                {
                    id: "nocanvas",
                    match: "flag",
                    flag: "--nocnavas"
                }
            ],
            cooldown: 1.5e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    };
    async exec(message, { user, nocanvas }) {
        const { delmsg } = await this.client.util
        const member = message.guild.members.cache.get(user) || message.mentions.members.first() || message.member

        const presence = member.presence.activities.filter(x => x.name === 'Spotify')[0]
        if (!presence) return message.inlineReply(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Cannot find spotify presence")).then(x => { x.delete({ timeout: 10000 }) })

        var songname;
        var album;
        var auth;
        var title;
        var url;
        var img;
        var start;
        var end;

        try {
            songname = presence.details;
            album = presence.assets.largeText;
            auth = presence.state;
            title = `${presence.state} • ${presence.details}`;
            url = `https://open.spotify.com/track/${presence.syncID}`;
            img = `https://i.scdn.co/image/${presence.assets.largeImage.slice(8)}`;
            start = presence.timestamps.start;
            end = presence.timestamps.end
        } catch {
            return message.inlineReply(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Cannot find spotify presence")).then(x => { x.delete({ timeout: 10000 }) })
        };

        const duration = end - start;
        const progress = Date.now() - start;

        const convertms = convert(duration)
        const minutes = convertms.minutes < 10 ? `0${convertms.minutes}` : convertms.minutes;
        const seconds = convertms.seconds < 10 ? `0${convertms.seconds}` : convertms.seconds;

        const progressconvert = convert(progress);
        const progressminutes = progressconvert.minutes < 10 ? `0${progressconvert.minutes}` : progressconvert.minutes;
        const progressseconds = progressconvert.seconds < 10 ? `0${progressconvert.seconds}` : progressconvert.seconds;

        const progressrun = `${progressminutes}:${progressseconds}`;
        const endprogress = `${minutes}:${seconds}`;

        if (nocanvas) {
            let e = createEmbed("spotify")
                .setAuthor(`Spotify Song Information`, 'https://media.discordapp.net/attachments/570740974725103636/582005158632882176/Spotify.png', url)
                .setDescription(
                    `\`\`\`asciidoc\n` +
                    `• SongName     :: ${songname}\n` +
                    `• SongAlbum    :: ${album}\n` +
                    `• SongAuthor   :: ${auth}\n` +
                    `• SongDuration :: [${progressrun}] - [${endprogress}]\n` +
                    `\`\`\``
                )
                .setThumbnail(img)
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            return message.channel.send(e)
        };
        const canvas = createCanvas(1280, 423);
        const ctx = canvas.getContext("2d");
        let hex = await GetColor(img);

        ctx.beginPath()
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(await loadImage(img), 1280 - 423, 0, 423, 423)

        var lingrad = ctx.createLinearGradient(1500, 0, 900, 0)
        lingrad.addColorStop(0, "rgba(0,0,0,0.0)")
        lingrad.addColorStop(1, `${hex}`)
        ctx.restore()
        ctx.fillStyle = lingrad
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const logo = await SpotifyImg(img, path);
        ctx.drawImage(await loadImage(logo), 50, 40, 80, 80)

        const colortext = await TextColor(img);
        ctx.font = "40px Sans";
        ctx.fillStyle = colortext;
        ctx.fillText(progressrun, 70, canvas.height - 40);

        ctx.font = "40px Sans";
        ctx.fillStyle = colortext;
        ctx.fillText(endprogress, canvas.width - 180, canvas.height - 40);

        ctx.font = "40px Sans";
        ctx.fillStyle = colortext;
        ctx.fillText(fittingString(ctx, `Spotify • ${album}`, canvas.width - (canvas.height + 50)), 130, 90)

        ctx.font = "80px Sans";
        ctx.fillStyle = colortext;
        ctx.fillText(fittingString(ctx, songname, canvas.width - (canvas.height + 50)), 70, (canvas.height / 2) - 20)

        ctx.font = "50px Sans";
        ctx.fillStyle = colortext;
        ctx.fillText(fittingString(ctx, auth, canvas.width - (canvas.height + 50)), 70, (canvas.height / 2) + 50)

        const barcolor = await barprogress(img);
        ctx.rect(70, canvas.height - 100, canvas.width - 148, 8);
        ctx.fillStyle = barcolor;
        ctx.fillRect(70, canvas.height - 100, canvas.width - 148, 8);

        const toFormat = (progress / duration) * (canvas.width - 148);
        ctx.fillStyle = colortext;
        ctx.fillRect(70, canvas.height - 100, toFormat, 8);

        var deletit = await message.inlineReply(new MessageAttachment(canvas.toBuffer(), "data.png"));
        await delmsg(deletit, message)
    };
};

async function SpotifyImg(img, path) {
    try {
        const data = await colorThief.getColor(img).then(x => {
            return x
        });
        const torgb = await data.toString().split(",");
        const getcolor = (0.299 * torgb[0] + 0.587 * torgb[1] + 0.114 * torgb[2]) / 255;
        let d
        if (getcolor > 0.5) {
            d = await path.join(__dirname, "..", "..", "data", "images", "SpotifyBlack.png");
        } else {
            d = await path.join(__dirname, "..", "..", "data", "images", "SpotifyWhite.png")
        };
        return d
    } catch (e) {
        console.log(e)
    }
};

async function barprogress(img) {
    try {
        const data = await colorThief.getColor(img).then(x => {
            return x
        });
        const torgb = await data.toString().split(",");
        const getcolor = (0.299 * torgb[0] + 0.587 * torgb[1] + 0.114 * torgb[2]) / 255;
        let d = 0
        if (getcolor > 0.5) {
            d = 255;
        } else {
            d = 0;
        };
        return onecolor(`rgb(${d}, ${d}, ${d})`).hex()
    } catch (e) {
        console.log(e)
    }
};

async function TextColor(img) {
    try {
        const data = await colorThief.getColor(img).then(x => {
            return x
        });
        const torgb = await data.toString().split(",");
        const getcolor = (0.299 * torgb[0] + 0.587 * torgb[1] + 0.114 * torgb[2]) / 255;
        let d = 0
        if (getcolor > 0.5) {
            d = 0;
        } else {
            d = 255;
        };
        return onecolor(`rgb(${d}, ${d}, ${d})`).hex()
    } catch (e) {
        console.log(e)
    }
};

async function GetColor(img) {
    try {
        const data = colorThief.getColor(img).then(x => {
            const rgb = x.toString().split(',');
            const data = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            return onecolor(data).hex()
        });

        return data
    } catch (e) {
        if (e) throw Error("Server error")
    }
};

function fittingString(c, str, maxWidth) {
    let width = c.measureText(str).width;
    let ellipsis = '…';
    let ellipsisWidth = c.measureText(ellipsis).width;
    if (width <= maxWidth || width <= ellipsisWidth) {
        return str;
    } else {
        var len = str.length;
        while (width >= maxWidth - ellipsisWidth && len-- > 0) {
            str = str.substring(0, len);
            width = c.measureText(str).width;
        }
        return str + ellipsis;
    }
}

async function roundRect(ctx, x, y, width, height, radius, fill, stroke, color) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.fillStyle = color
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}