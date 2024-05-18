const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let coordinateUpdateInterval;
let isUpdatingCoordinates = false;

function updateCoordinates() {
  const devices = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
    direction: Math.random() * 2 * Math.PI,
  }));
  io.emit("DEVICES_INFO", devices);
}

// WebSocket connection handler
io.on("connection", (ws) => {
  console.log(`Listener socket`, ws.id);

  if (!isUpdatingCoordinates) {
    console.log('trigger')
    coordinateUpdateInterval = setInterval(updateCoordinates, 22222);
    isUpdatingCoordinates = true;
  }

  ws.on("disconnect", () => {
    console.log(`Listener socket disconnected`, ws.id);
    if (io.sockets.sockets.size === 0) {
      clearInterval(coordinateUpdateInterval);
      isUpdatingCoordinates = false;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
