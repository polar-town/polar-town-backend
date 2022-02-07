const createError = require("http-errors");
const axios = require("axios");

const postTrash = (req, res, next) => {
  const { gapiauthorization } = req.headers;
  const { mailId } = req.body;

  mailId.forEach(async (id) => {
    try {
      await axios.post(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`,
        null,
        {
          headers: { Authorization: gapiauthorization },
        }
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  res.send({ result: "ok" });
};

const deleteTrash = async (req, res, next) => {
  const { gapiauthorization } = req.headers;
  const accessToken = gapiauthorization.split(" ")[1];
};

module.exports = { postTrash, deleteTrash };
