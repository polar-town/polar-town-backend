const EVENTS = {
  JOIN: "join",
  LEFT: "left",
  GET_MESSAGES: "getMessage",
  SEND_MESSAGE: "sendMessage",
  DISCONNECT: "disconnect",
  FRIEND_REQUEST: "friendRequest",
};

const TYPE = {
  SIGNOUT: "signout",
  TRANSITION: "transition",
};

module.exports = { EVENTS, TYPE };
