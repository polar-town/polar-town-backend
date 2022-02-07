const createError = require("http-errors");
const axios = require("axios");

const handleTrash = async (req, res, next) => {
  const { gapiauthorization } = req.headers;
  const accessToken = gapiauthorization.split(" ")[1];
  const { mailId } = req.body;

  const test = axios.post(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/17ed1e55206fde08/trash",
    null,
    {
      headers: { Authorization: accessToken },
    }
  );
};

const emptyTrash = async (req, res, next) => {
  const { gapiauthorization } = req.headers;
  const accessToken = gapiauthorization.split(" ")[1];
};

module.exports = { handleTrash, emptyTrash };
