const app = require("express")();
const { MCServer } = require('./lib/mcserver');
const cors = require('cors')
const httpServer = require("http").createServer(app);
const bodyParser = require('body-parser');
const { getRoutes } = require('./routes');
const options = {
    cors: {
        origin: '*',
    }
};
const io = require("socket.io")(httpServer, options);


const PORT = (process.env.PORT || 3500);

const minecraftServer = new MCServer("8d1d62c9-1e27-4a4f-9a26-a4ea1804222c");

app.set('minecraftServer', minecraftServer);

//--Middleware--//
app.use(cors())
app.use(bodyParser.json())

//--ROUTES--//
app.use('/', getRoutes(minecraftServer));
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