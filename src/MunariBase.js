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
const MuriNode3 = { name: "MuriNode3", host: "MuriNode3.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' }
const LavalinkServer = [MuriNode, MuriNode2, MuriNode3];

const Muri = new MunariClient({
    boatsapi: '2bo3CkMT7P6CNxx7IBQrO5haxlOsSPazT8ExCCKAvUVxzuW8bKlsJqw3JH6yDd40B39zmNIGS4uV4SgVY3w54fIaiRiA0mJkMzlNlkCFCKvxoL4mtI1ABWvRfmpnUDrj8RutB2rjA7Uv9rVp9k9wt4G9VCr',
    alexapi: '93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb',
    ytapiL: "AIzaSyAeoZxsotVd1HdcqG8KXAIzS_O8FxQbel0",
    spcid: "1403b5f83a244f70ba0e2bcc6892aac2",
    spcs: "d2d1d2e3e2a0480dab57dc279b61634f",
    sessionid: "14643228375:pBgARot5BdWf0b:3",
    nodes: LavalinkServer
});

Muri.start();