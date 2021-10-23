const express = require("express");
const app = express();
const { MCServer } = require("./lib/mcserver");
const cors = require("cors");
const httpServer = require("http").createServer(app);
const sysmonitor = require("./lib/sysmonitor").sysmonitor;
const logger = require('./lib/logger').logger;
const { getRoutes } = require("./routes");
const options = {
  cors: {
    origin: "*",
  },
};
const io = require("socket.io")(httpServer, options);

const PORT = process.env.PORT || 3500;

const minecraftServer = new MCServer("8d1d62c9-1e27-4a4f-9a26-a4ea1804222c");

app.set("minecraftServer", minecraftServer);

//--Middleware--//
app.use(cors());
app.use(express.json());


//--ROUTES--//
app.use("/server", getRoutes(minecraftServer));

//--Error Handlers--//
app.use((req, res) => res.status(404).send("404 NOT FOUND"));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(() => {
  logger.info('Express Server Started');
})


//----Setting up Event Listeners----//

io.on("connection", (socket) => {
  logger.debug('Client Connected to Socket')
});

minecraftServer.on("console", (data) => {
  io.emit("console", data);
});

minecraftServer.on("state", (state) => {
  io.emit("state", state);
});

httpServer.listen(PORT, () => {
  logger.info(`Server Started on Port ${PORT}`);
});

//--Automatically fetch system usage and share with client every 2000ms--//
setInterval(() => {
  sysmonitor
    .getSysStats()
    .then((sysStats) => {
      io.emit("sysmonitor", sysStats);
    })
    .catch((err) => {
      console.error(err);
    });
}, 2000);
