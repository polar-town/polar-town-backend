const EVENTS = {
  JOIN: "join",
  LEFT: "left",
  OPEN_POSTBOX: "openPostBox",
  READ_MESSAGES: "readMessage",
  GET_MESSAGES: "getMessage",
  SEND_MESSAGE: "sendMessage",
  DISCONNECT: "disconnect",
};

const TYPE = {
  SIGNOUT: "signout",
  TRANSITION: "transition",
};

module.exports = { EVENTS, TYPE };
