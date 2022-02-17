const { Server } = require("socket.io");
const Visitor = require("./data/visitor");
const Guestbook = require("./data/guestbook");
const Town = require("./data/town");
const { EVENTS, TYPE } = require("./constants/index");
const User = require("./models/User");

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

        this.TOWN_CHANNEL[townId].addVisitor(user);
        this.ONLINE_USER[user.email] = { townId, socketId };

        this.io.to(townId).emit(EVENTS.JOIN, {
          visitors: this.TOWN_CHANNEL[townId].getVisitors(),
          user,
        });

        socket.on(EVENTS.DISCONNECT, (data) => {
          const visitors = this.TOWN_CHANNEL[townId].removeVisitor(user);

          this.io.to(townId).emit(EVENTS.LEFT, { visitors, user });
        });
      });

      socket.on(EVENTS.SEND_PRESENT, async (data) => {
        const { from, to } = data;

        if (this.ONLINE_USER[to]) {
          this.io.to(this.ONLINE_USER[to].socketId).emit(EVENTS.GET_PRESENT, {
            from,
          });
        }
      });

      socket.on(EVENTS.LEFT, (data) => {
        const { prevTownId, user, type } = data;
        const visitors = this.TOWN_CHANNEL[prevTownId].removeVisitor(user);

        this.io.to(prevTownId).emit(EVENTS.LEFT, {
          visitors,
          user,
        });

        socket.leave(prevTownId);

        if (!visitors?.length) {
          delete this.TOWN_CHANNEL[prevTownId];
        }

        if (type === TYPE.SIGNOUT) {
          delete this.ONLINE_USER[user.email];
        }
      });

      socket.on(EVENTS.SEND_MESSAGE, async (data) => {
        const { townId, message } = data;
        const updatedMessageList = await this.TOWN_CHANNEL[townId].addGuestbook(
          townId,
          message,
        );

        this.io.to(townId).emit(EVENTS.GET_MESSAGES, updatedMessageList);
      });

      socket.on(EVENTS.FRIEND_REQUEST, (data) => {
        const { to, userName, email } = data;

        if (this.ONLINE_USER[to]) {
          const { socketId } = this.ONLINE_USER[to];

          this.io.to(socketId).emit(EVENTS.FRIEND_REQUEST, {
            userName,
            email,
          });
        }
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

function getSocketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io;
}

function getOnlineUser() {
  if (!socket) {
    throw new Error("Please call init first");
  }

  return socket.ONLINE_USER;
}

function getTownData(townId) {
  if (!socket) {
    throw new Error("Please call init first");
  }

  return socket.TOWN_CHANNEL[townId];
}

module.exports = {
  initSocket,
  getSocketIO,
  getOnlineUser,
  getTownData,
};
