const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const getUserInfo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    res.json({
      result: user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getGuestBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();
    const userGuestBook = user.guestBook;

    res.json({ result: { guestBook: userGuestBook } });
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
  let userEmail;

  try {
    jwt.verify(
      refershToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return createError(403, "Forbidden");
        }

        userEmail = decoded.email;
      }
    );

    const user = await User.findOne({ email: userEmail }).exec();
    const userName = user.name;

    const newMessage = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          guestBook: { name: userName, message, date: isoDateTime },
        },
      },
      { new: true }
    );

    res.json({ result: newMessage });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const toggleItem = async (req, res, next) => {
  const { id, itemId } = req.params;
  const { from, to } = req.body;

  try {
    const item = await User.findByIdAndUpdate(
      id,
      {
        $pull: { [from]: itemId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(id, {
      $push: {
        [to]: {
          purchasedBy: item.purchasedBy,
          name: item.name,
          location: [0, 0],
        },
      },
    });

    const user = User.findById(id);

    res.json({
      result: {
        inbox: user.inItemBox,
        outBox: user.outItemBox,
        presentBox: user.presentBox,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const changeItemLocation = async (req, res, next) => {
  const { id, itemId } = req.params;
  const { newLocation } = req.body;

  try {
    const item = await User.findByIdAndUpdate(
      id,
      { $set: { "outItemBox.$[item].location": newLocation } },
      { arrayFilters: [{ "item._id": itemId }] },
      { new: true }
    );

    res.json({ result: item });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getUserInfo,
  getGuestBook,
  addMessage,
  toggleItem,
  changeItemLocation,
};
