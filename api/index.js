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

let devices = Array.from({ length: 500 }, (_, index) => ({
  id: index + 1,
  latitude: Math.random() * 180 - 90,
  longitude: Math.random() * 360 - 180,
}));

function updateCoordinates() {
    const devices = Array.from({ length: 500 }, (_, index) => ({
      id: index + 1,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
    }));

    io.emit("DEVICES_INFO", devices);
}


// WebSocket connection handler
io.on("connection", (ws) => {
  console.log(`Listener socket`, ws.id);

  ws.emit("DEVICES_INFO", devices);

  setInterval(updateCoordinates, 20000);
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


