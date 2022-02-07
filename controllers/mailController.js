const createError = require("http-errors");
const axios = require("axios");

const handleTrash = (req, res, next) => {
  const { gapiAuthorization } = req.headers;
};

const emptyTrash = (req, res, next) => {
  const { gapiAuthorization } = req.headers;
};

module.exports = { handleTrash, emptyTrash };
