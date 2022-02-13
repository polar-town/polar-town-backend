const { Server } = require("socket.io");
const Visitor = require("./data/visitor");
const Guestbook = require("./data/guestbook");
const Town = require("./data/town");
const { EVENTS, TYPE } = require("./constants/index");

class Socket {
  constructor(server) {
    this.ONLINE_USER = {};
    this.TOWN_CHANNEL = {};

    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
      },
    });

    this.io.on("connection", (socket) => {
      const socketId = socket.id;

      socket.on(EVENTS.JOIN, async (data) => {
        const { townId, user } = data;

        socket.join(townId);

        if (!this.TOWN_CHANNEL[townId]) {
          const visitor = new Visitor();
          const guestbook = new Guestbook();
          const town = new Town(visitor, guestbook);

          this.TOWN_CHANNEL[townId] = town;
        }

        user.socketId = socketId;
        this.TOWN_CHANNEL[townId].addVisitor(user);
        this.ONLINE_USER[user.email] = townId;

        this.io.to(townId).emit(EVENTS.JOIN, {
          visitors: this.TOWN_CHANNEL[townId].getVisitors(),
          user,
        });
        console.log(this.ONLINE_USER, this.TOWN_CHANNEL);
      });

      socket.on(EVENTS.LEFT, (data) => {
        const { prevTownId, user, type } = data;

        if (type === TYPE.SIGNOUT) {
          delete this.ONLINE_USER[user.email];
        }

        this.TOWN_CHANNEL[prevTownId].removeVisitor(user);
        this.io.to(prevTownId).emit(EVENTS.LEFT, {
          visitors: this.TOWN_CHANNEL[prevTownId].getVisitors(),
          user,
        });
        socket.leave(prevTownId);
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
