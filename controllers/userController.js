const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const getUserInfo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    res.json({
      user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getGuestBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userGuestBook = await User.findById(id).guestBook.exec();

    res.json(userGuestBook);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addMessage = async (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;
  const refershToken = req.cookies.jwt;
  const isoDateTime = new Date().toISOString();
  let currentUserEmail;

  try {
    jwt.verify(
      refershToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return createError(403, "Forbidden");
        }

        currentUserEmail = decoded.email;
      }
    );

    const currentUserName = await User.findOne({ email: currentUserEmail })
      .name;

    const newMessage = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          guestBook: { name: currentUserName, message, date: isoDateTime },
        },
      },
      { new: true }
    );

    res.json(newMessage);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getUserInfo,
  getGuestBook,
  addMessage,
};
