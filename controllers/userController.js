const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const getFriendList = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("friendList.userId").exec();

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

    await User.findByIdAndUpdate(deleteTarget._id, {
      $pull: { friendList: { userId: id } },
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
    const user = await User.findById(id)
      .populate("pendingFriendList.userId")
      .exec();

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

const deletePendingFriendList = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const deleteTarget = await User.findOne({ email }).exec();

    await User.findByIdAndUpdate(id, {
      $pull: { pendingFriendList: { userId: deleteTarget._id } },
    });

    res.json({
      result: "ok",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getInItemBox = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).exec();

    res.json({
      result: {
        inItemBox: user.inItemBox,
      },
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
    if (name === "Ice") {
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

const getSearchResult = async (req, res, next) => {
  const { page = 1, size = 10, keyword = "" } = req.query;
  const query = keyword && new RegExp(keyword);
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  try {
    const users = await User.find(query ? { email: query } : {})
      .limit(limit)
      .skip(skip);

    res.json({ result: { page, size, users } });
  } catch (error) {
    console.error(error);
    next(error);
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

    await User.findByIdAndUpdate(pendingFriend._id, {
      $push: {
        friendList: { userId: id, isChecked: true },
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

module.exports = {
  getSearchResult,
  getUserInfo,
  getGuestBook,
  addMessage,
  changeItemStorage,
  changeItemLocation,
  acceptFriendRequest,
  getInItemBox,
  addInItem,
  getPresentBox,
  addPresentItem,
  getFriendList,
  deleteFriend,
  getPendingFriendList,
  addPendingFriendList,
  deletePendingFriendList,
};
