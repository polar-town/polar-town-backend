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

    await User.findByIdAndUpdate(
      id,
      {
        $push: {
          guestBook: { name: userName, message, date: isoDateTime },
        },
      },
      { new: true }
    );

    res.json({
      result: {
        newMessage: {
          name: userName,
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

const toggleItem = async (req, res, next) => {
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
      { arrayFilters: [{ "item._id": itemId }] }
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

const acceptFriendRequest = async (req, res, next) => {
  const { id } = req.params;
  const { email, isAlarm } = req.body;
  const newPendingFriendList = [];
  const newFriendList = [];

  try {
    const user = await User.findById(id);
    const pendingFriend = await User.findOne({ email });

    user.pendingFriendList.forEach((friend) => {
      if (String(friend.userId) === String(pendingFriend._id)) {
        newFriendList.push({ userId: pendingFriend._id, isChecked: true });
      } else {
        if (isAlarm) {
          newPendingFriendList.push({ userId: friend.userId });
        }
        if (!isAlarm) {
          newPendingFriendList.push({ userId: friend.userId, isChecked: true });
        }
      }
    });

    user.pendingFriendList = newPendingFriendList;
    user.friendList.push(...newFriendList);

    await user.save();

    res.json({
      result: "ok",
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
  toggleItem,
  changeItemLocation,
  acceptFriendRequest,
};
