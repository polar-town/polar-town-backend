const { Server } = require("socket.io");
const Visitor = require("./data/visitor");
const Guestbook = require("./data/guestbook");
const Town = require("./data/town");

class Socket {
  constructor(server) {
    this.ONLINE_USER = {};
    this.TOWN_DATA = {};

    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
      },
    });

    this.io.on("connection", (socket) => {
      const socketId = socket.id;

      socket.on("newVisitor", async (data) => {
        const { townId, user } = data;

        if (!this.TOWN_DATA[townId]) {
          const visitor = new Visitor();
          const guestbook = new Guestbook();
          const town = new Town(visitor, guestbook);

          this.TOWN_DATA[townId] = town;
        }

        socket.join(townId);

        if (this.ONLINE_USER[user.email]) {
          const prevTownId = this.ONLINE_USER[user.email];
          this.TOWN_DATA[prevTownId].removeVisitor(user);

          socket.leave(prevTownId);
          this.io.to(prevTownId).emit("visitorLeft", {
            visitors: this.TOWN_DATA[prevTownId].getVisitors(),
            user,
          });
        }

        user.socketId = socketId;
        this.TOWN_DATA[townId].addVisitor(user);
        this.ONLINE_USER[user.email] = townId;

        this.io.to(townId).emit("newVisitor", {
          visitors: this.TOWN_DATA[townId].getVisitors(),
          user,
        });
      });
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

function getOnlineUser() {
  return this.ONLINE_USER;
}

function getTownData() {
  return this.TOWN_DATA;
}

module.exports = { initSocket, getSocketIo, getOnlineUser, getTownData };
