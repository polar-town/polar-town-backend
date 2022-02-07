const createError = require("http-errors");
const axios = require("axios");

const postTrash = async (req, res, next) => {
  const { gapiauthorization } = req.headers;
  const { mailId } = req.body;

  try {
    await axios.post(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify`,
      {
        ids: mailId,
        addLabelIds: ["TRASH"],
        removeLabelIds: ["CATEGORY_PROMOTIONS", "SPAM"],
      },
      {
        headers: { Authorization: gapiauthorization },
      }
    );

    res.send({ result: "ok" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteTrash = async (req, res, next) => {
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

module.exports = { postTrash, deleteTrash };
