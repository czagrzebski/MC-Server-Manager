const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {cors: {
    origin: '*',
  }};
const io = require("socket.io")(httpServer, options);
const { MCServer } = require('./lib/mcserver')
const PORT = 3300

const minecraftServer = new MCServer();



io.on("connection", socket => {
    console.log("Client Connected")

    socket.on('command', (command) => {
        if(command === 'start'){
            minecraftServer.startServer().then(response => console.log(response)).catch(err => console.log(err));
        }else if(command === 'stop'){
            minecraftServer.killServer().then(response => console.log(response));
        }
    })
});

httpServer.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});

minecraftServer.on('console', (data) => {
    io.emit('console', data);
})

minecraftServer.on('state', (state) => {
    io.emit('state', state);
})