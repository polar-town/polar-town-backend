const axios = require("axios");
const { getMailBody } = require("../utils/getMailBody");

const getMailList = async (req, res, next) => {
  const { gapitAuthorization } = req.headers;
  const { inBoxId } = req.params;

  try {
    const headers = { authorization: gapitAuthorization };
    const mailListUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=${inBoxId}&maxResults=1`;
    const response = await axios.get(mailListUrl, { headers });
    const nextPageToken = response.data.nextPageToken;

    const mailList = await Promise.all(
      response.data.messages.map(async (message) => {
        const id = message.id;
        const getEachMailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`;
        const mail = await axios.get(getEachMailUrl, { headers });

        return mail.data;
      }),
    );

    const incodedMailList = mailList.map((mail) => {
      let from, date, subject;

      mail.payload.headers.forEach((header) => {
        header.name === "From" && (from = header.value);
        header.name === "Date" && (date = header.value);
        header.name === "Subject" && (subject = header.value);
      });

      const incodedMail = {
        id: mail.id,
        from,
        date,
        subject,
        snippet: mail.snippet,
        content: getMailBody(mail.payload),
      };

      return incodedMail;
    });

    const result = {
      result: incodedMailList,
      nextPageToken,
    };

    return res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const postTrash = (req, res, next) => {};

const deleteTrash = (req, res, next) => {};

module.exports = {
  getMailList,
  postTrash,
  deleteTrash,
};
