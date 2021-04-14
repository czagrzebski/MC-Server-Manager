const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {};
const io = require("socket.io")(httpServer, options);
const { MCServer } = require('./mcserver')
const PORT = 3300

const minecraftServer = new MCServer();

minecraftServer.startServer().then(response => console.log(response));

io.on("connection", socket => {
    console.log("Client Connected")
});

console.log(process.cwd());

httpServer.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
});