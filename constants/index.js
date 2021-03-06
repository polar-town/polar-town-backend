const EVENTS = {
  JOIN: "join",
  LEFT: "left",
  OPEN_POSTBOX: "openPostBox",
  READ_MESSAGES: "readMessage",
  GET_MESSAGES: "getMessage",
  SEND_MESSAGE: "sendMessage",
  DISCONNECT: "disconnect",
  GET_PRESENT: "getPresent",
  SEND_PRESENT: "sendPresent",
  FRIEND_REQUEST: "friendRequest",
};

const TYPE = {
  SIGNOUT: "signout",
  TRANSITION: "transition",
};

const LOCATION = {
  STATIC_LOCATION: [600, 290],
};

module.exports = { EVENTS, TYPE, LOCATION };
