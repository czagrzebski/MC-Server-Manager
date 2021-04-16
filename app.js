const app = require("express")();
const { MCServer } = require('./lib/mcserver');
const httpServer = require("http").createServer(app);
const options = {cors: {origin: '*',}};
const io = require("socket.io")(httpServer, options);
const minecraftController = require('./controllers/minecraftController');

const PORT = (process.env.PORT || 3500);

const minecraftServer = new MCServer();

//--ROUTES--//
app.get('/', (req, res) => res.json('success'));
app.get('/server/start', minecraftController.startServer(minecraftServer));
app.get('/server/kill', minecraftController.killServer(minecraftServer));
app.use((req, res) => res.status(404).send('404 NOT FOUND'));
app.use((req, res) => res.status(500).send('INTERNAL SERVER ERROR'));


//----Setting up Event Listeners----//

io.on("connection", socket => {
    console.log("Client Connected")
});

minecraftServer.on('console', (data) => {
    io.emit('console', data);
})

minecraftServer.on('state', (state) => {
    io.emit('state', state);
})

httpServer.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});

