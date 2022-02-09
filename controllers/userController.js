const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const getFriendList = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    res.json({
      result: user.friendList,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteFriend = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const deleteTarget = await User.findOne({ email }).exec();

    await User.findByIdAndUpdate(id, {
      $pull: { friendList: { userId: deleteTarget._id } },
    });

    res.json({
      result: "ok",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getPendingFriendList = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    res.json({
      result: user.pendingFriendList,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addPendingFriendList = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    await User.findOneAndUpdate(
      { email },
      {
        $push: {
          pendingFriendList: {
            userId: id,
            isChecked: false,
          },
        },
      },
    ).setOptions({ runValidators: true });

    res.status(201).json({
      result: "ok",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getInItemBox = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    res.json({
      result: user.inItemBox,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addInItem = async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    if (name === "ice") {
      await User.findByIdAndUpdate(id, {
        $inc: { iceCount: 1, cokeCount: -price },
      });

      return res.json({
        result: "ok",
      });
    }

    await User.findByIdAndUpdate(id, {
      $inc: { cokeCount: -price },
      $push: {
        inItemBox: {
          purchasedBy: "me",
          name,
          location: [0, 0],
        },
      },
    });

    res.json({
      result: "ok",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getPresentBox = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    res.json({
      result: user.presentBox,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addPresentItem = async (req, res, next) => {
  const { id } = req.params;
  const { presentTo, name, price } = req.body;

  try {
    const user = await User.findById(id).exec();

    await User.findByIdAndUpdate(id, {
      $inc: { cokeCount: -price },
    });

    await User.findByIdAndUpdate(presentTo, {
      $push: {
        presentBox: {
          purchasedBy: user.email,
          name,
          location: [0, 0],
        },
      },
    });

    res.status(201).json({
      result: "ok",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

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

    res.json({ result: { guestBook: user.guestBook } });
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
      },
    );

    const user = await User.findOne({ email: userEmail }).exec();
    const name = user.name;

    await User.findByIdAndUpdate(
      id,
      {
        $push: {
          guestBook: { name, message, date: isoDateTime },
        },
      },
      { new: true },
    );

    res.json({
      result: {
        newMessage: {
          name,
          message,
          date: isoDateTime,
        },
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const changeItemStorage = async (req, res, next) => {
  const { id, itemId } = req.params;
  const { from, to } = req.body;
  const targetItem = [];
  const restItems = [];

  try {
    const user = await User.findByIdAndUpdate(id).exec();

    user[from].forEach((item) => {
      if (item._id.toString() === itemId) {
        item.location = [100, 100];
        targetItem.push(item);
      } else {
        restItems.push(item);
      }
    });

    user[from] = restItems;
    user[to].push(...targetItem);

    const result = await user.save();

    res.json({
      result: {
        inbox: result.inItemBox,
        outBox: result.outItemBox,
        presentBox: result.presentBox,
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
    await User.findByIdAndUpdate(
      id,
      { $set: { "outItemBox.$[item].location": newLocation } },
      { arrayFilters: [{ "item._id": itemId }] },
    );

    res.json({
      result: {
        itemId,
        location: newLocation,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getUserInfo,
  getGuestBook,
  addMessage,
  changeItemStorage,
  changeItemLocation,
  getInItemBox,
  addInItem,
  getPresentBox,
  addPresentItem,
  getFriendList,
  deleteFriend,
  getPendingFriendList,
  addPendingFriendList,
};
