const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const MONGO_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/tindev";
const PORT = process.env.PORT || 7777;

const routes = require("./routes");

const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);

const connectedUsers = {};

io.on("connection", (socket) => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
});

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());

app.use(express.json());

app.use(routes);

server.listen(PORT);
