const axios = require("axios");

const moveToTrash = async (req, res, next) => {
  const { gapiauthorization } = req.headers;
  const { mailId } = req.body;
  const headers = { Authorization: gapiauthorization };

  try {
    await axios.post(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify",
      {
        ids: mailId,
        addLabelIds: ["TRASH"],
        removeLabelIds: ["CATEGORY_PROMOTIONS", "SPAM"],
      },
      headers
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
  const headers = { Authorization: gapiauthorization };

  try {
    await axios.post(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/batchDelete",
      {
        ids: mailId,
      },
      headers
    );

    res.send({ result: "ok" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  moveToTrash,
  deleteTrash,
};
