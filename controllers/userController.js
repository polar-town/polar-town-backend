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

const toggleItem = async (req, res, next) => {
  const { id, itemId } = req.params;
  const { from, to } = req.body;

  try {
    const item = await User.findByIdAndUpdate(
      id,
      {
        $pullAll: { [from]: itemId },
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

    const allItems = User.findById(id);

    res.json({
      inbox: allItems.inItemBox,
      outBox: allItems.outItemBox,
      presentBox: allItems.presentBox,
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
      { $set: { "outItemBox.$[item]": newLocation } },
      { arrayFilters: [{ "item._id": itemId }] },
      { new: true }
    );

    res.json(item);
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
