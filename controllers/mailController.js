const axios = require("axios");
const User = require("../models/User");
const { getMailBody } = require("../utils/getMailBody");

const getMailList = async (req, res, next) => {
  const { gapiauthorization } = req.headers;
  let { inBoxId, pageToken } = req.params;

  pageToken === "null" ? (pageToken = "") : pageToken;

  try {
    const headers = { Authorization: gapiauthorization };
    const mailListUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=${inBoxId}&maxResults=10&pageToken=${pageToken}`;
    const response = await axios.get(mailListUrl, { headers });
    const nextPageToken = response.data.nextPageToken;

    if (!response.data.resultSizeEstimate) {
      return res.json({ result: [] });
    }

    const mailList = await Promise.all(
      response.data.messages.map(async (message) => {
        const id = message.id;
        const getEachMailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`;
        const mail = await axios.get(getEachMailUrl, { headers });

        return mail.data;
      })
    );

    const decodedMailList = mailList.map((mail) => {
      let from, date, subject;

      mail.payload.headers.forEach((header) => {
        header.name === "From" && (from = header.value);
        header.name === "Date" && (date = header.value);
        header.name === "Subject" && (subject = header.value);
      });

      const decodedMail = {
        id: mail.id,
        from,
        date,
        subject,
        snippet: mail.snippet,
        content: getMailBody(mail.payload),
      };

      return decodedMail;
    });

    const result = {
      result: decodedMailList,
      nextPageToken,
    };

    return res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

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
      { headers }
    );

    res.send({ result: "ok" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteTrash = async (req, res, next) => {
  const { id } = req.params;
  const { gapiauthorization } = req.headers;
  const { mail, cokeCount } = req.body;
  const headers = { Authorization: gapiauthorization };

  try {
    await axios.post(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/batchDelete",
      {
        ids: mail,
      },
      { headers }
    );

    await User.findByIdAndUpdate(id, {
      $inc: {
        cokeCount,
      },
    });

    res.send({ result: "ok" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getMailList,
  moveToTrash,
  deleteTrash,
};
