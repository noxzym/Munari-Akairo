const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment } = require("discord.js");
const { join } = require("path");

module.exports = class CanvasHandler {
    constructor(client) {
        this.client = client
    };
    async gay(img) {
        const image = await loadImage(img);
        const bg = await loadImage(join(__dirname, "..", "data", "images", "gay.png"));
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        return canvas.toBuffer()
    }

    async greyscale(img) {
        const image = await loadImage(img);
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            const brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
            imgData.data[i] = brightness;
            imgData.data[i + 1] = brightness;
            imgData.data[i + 2] = brightness;
        };

        ctx.putImageData(imgData, 0, 0);

        return canvas.toBuffer();
    };

    async invert(img) {
        const image = await loadImage(img);
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
            imgData.data[i + 3] = 255;
        }

        ctx.putImageData(imgData, 0, 0);

        return canvas.toBuffer()
    };

    async sepia(img) {
        const image = await loadImage(img);
        const canvas = createCanvas(500, 500)
        const ctx = canvas.getContext("2d")
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < data.data.length; i += 4) {
            const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
            data.data[i] = brightness + 100;
            data.data[i + 1] = brightness + 50;
            data.data[i + 2] = brightness;
        }
        ctx.putImageData(data, 0, 0);

        return canvas.toBuffer()
    };

    async contrast(img) {
        const image = await loadImage(img);
        const canvas = createCanvas(500, 500)
        const ctx = canvas.getContext("2d")
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const factor = (259 / 100) + 1;
        const intercept = 128 * (1 - factor);
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = (data.data[i] * factor) + intercept;
            data.data[i + 1] = (data.data[i + 1] * factor) + intercept;
            data.data[i + 2] = (data.data[i + 2] * factor) + intercept;
        }
        ctx.putImageData(data, 0, 0);

        return await canvas.toBuffer();
    };

    async brightness(img, amount) {
        const image = await loadImage(img);
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] += amount;
            imgData.data[i + 1] += amount;
            imgData.data[i + 2] += amount;
        }

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "brightness.png")
        return ath
    };

    async darkness(img, amount) {
        const image = await loadImage(img);
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] -= amount;
            imgData.data[i + 1] -= amount;
            imgData.data[i + 2] -= amount;
        }

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "darkness.png")
        return ath
    };

    async threshold(img, amount = 50) {
        const image = await loadImage(img);
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            var r = imgData.data[i];
            var g = imgData.data[i + 1];
            var b = imgData.data[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= amount) ? 255 : 0;
            imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = v
        }

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "threshold.png")
        return ath
    };

    async circle(image) {
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");

        ctx.save()
        ctx.beginPath()
        ctx.arc(250, 250, 250, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        ctx.drawImage(await loadImage(image), 0, 0, canvas.width, canvas.height)

        ctx.beginPath()
        ctx.arc(0, 0, 200, 0, Math.PI * 2, true)
        ctx.clip()
        ctx.closePath()
        return canvas.toBuffer();
    }
}