const EVENTS = {
  JOIN: "join",
  LEFT: "left",
  GET_MESSAGES: "getMessage",
  SEND_MESSAGE: "sendMessage",
  DISCONNECT: "disconnect",
  GET_PRESENT: "getPresent",
  SEND_PRESENT: "sendPresent",
};

const TYPE = {
  SIGNOUT: "signout",
  TRANSITION: "transition",
};

module.exports = { EVENTS, TYPE };
