const { Server } = require("socket.io");

class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
      },
    });

    this.io.on("connection", (socket) => {
      console.log("a user connected");
    });
  }
}

let socket;

function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

function getSocketIo() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io;
}

module.exports = { initSocket, getSocketIo };
