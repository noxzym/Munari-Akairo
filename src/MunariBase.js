require("dotenv").config()

/*MongoseManager*/
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://DexX:M0zila440@muridb.3gy8x.mongodb.net/database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
  console.log("Database Connected!")
}).catch((e) => {
  console.log("refuse to connect", e)
})

const MunariClient = require("./Structures/MunariClient");
const MuriNode = { name: "MuriNode", host: "MuriNode.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' };
const MuriNode2 = { name: "MuriNode2", host: "MuriNode2.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' };
const MuriNode3 = { name: "MuriNode3", host: "MuriNode3.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' };
const KagChi = { name: "KagChiNode", host: "eu2.bombhost.cloud", secure: false, port: 20871 , auth: "youshallnotpass", group: "minjem" };
const LavalinkServer = [MuriNode, MuriNode2, MuriNode3, KagChi];

const Muri = new MunariClient({
    boatsapi: '2bo3CkMT7P6CNxx7IBQrO5haxlOsSPazT8ExCCKAvUVxzuW8bKlsJqw3JH6yDd40B39zmNIGS4uV4SgVY3w54fIaiRiA0mJkMzlNlkCFCKvxoL4mtI1ABWvRfmpnUDrj8RutB2rjA7Uv9rVp9k9wt4G9VCr',
    alexapi: '93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb',
    ytapiL: "AIzaSyAeoZxsotVd1HdcqG8KXAIzS_O8FxQbel0",
    spcid: "c74bc6e28b154643b5b1f1f51c21fdfb",
    spcs: "ec94116a9a2c4212936afc33f55b697b",
    sessionid: "14643228375:pBgARot5BdWf0b:3",
    nodes: LavalinkServer
});

Muri.start();