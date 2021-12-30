const express = require("express");
const app = express();
const { MCServer } = require("./lib/mcserver");
const cors = require("cors");
const httpServer = require("http").createServer(app);
const sysmonitor = require("./lib/sysmonitor").sysmonitor;
const logger = require("./lib/logger").logger;
const minecraftRouter = require("./routes/minecraft");
const authRouter = require("./routes/auth");
const userRouter = require('./routes/users');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { manager } = require("./lib/manager");
const options = {
  cors: {
    origin: "*",
  },
};
const io = require("socket.io")(httpServer, options);

const PORT = process.env.PORT || 3500;

dotenv.config();

//--Middleware--//
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  logger.http("Request Received");
  next();
});

//--ROUTES--//
app.use("/server", minecraftRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);

//--Error Handlers--//
app.use((req, res) => res.status(404).send("404 NOT FOUND"));

app.use(function (err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send("Internal Server Error");
  next();
});

//Load and Initialize Minecraft Server
const initMinecraftServer = async () => {
  let minecraftServer;

  const serverList = await manager.getServerList();

  //Check if any servers exists, if not, create one.
  if (Object.keys(serverList).length == 0) {
    let uuid = await manager.createServer();
    minecraftServer = new MCServer(uuid);
  } else {
    minecraftServer = new MCServer(Object.keys(serverList)[0]);
  }

  //Allows routes/controllers to access minecraft server instance
  app.set("minecraftServer", minecraftServer);

  //Capture minecraft server events
  minecraftServer.on("console", (data) => {
    io.emit("console", data);
  });

  minecraftServer.on("state", (state) => {
    io.emit("state", state);
  });

  //Start Express Server after MCServer is initialized
  httpServer.listen(PORT, () => {
    logger.info(`Server Started on Port ${PORT}`);
  });
};

initMinecraftServer();

//----Setting up Event Listeners----//
io.on("connection", (socket) => {
  logger.debug("Client Connected to Socket");
});

//--Automatically fetch system usage and share with client every 2000ms--//
setInterval(() => {
  sysmonitor
    .getSysStats()
    .then((sysStats) => {
      io.emit("sysmonitor", sysStats);
    })
    .catch((err) => {
      logger.error(err);
    });
}, 2000);
