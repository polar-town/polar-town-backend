const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

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
    const user = await User.findById(id).exec();

    if (name === "ice") {
      await User.findByIdAndUpdate(id, {
        $set: {
          iceCount: (user.iceCount += 1),
          cokeCount: (user.cokeCount -= price),
        },
      });

      return res.json({
        result: "ok",
      });
    }

    await User.findByIdAndUpdate(id, {
      $set: {
        cokeCount: (user.cokeCount -= price),
      },
      $push: {
        inItemBox: {
          purchasedBy: user.email,
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
      $set: {
        cokeCount: (user.cokeCount -= price),
      },
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

    res.json({
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
      },
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
      { new: true },
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
  toggleItem,
  changeItemLocation,
  getInItemBox,
  addInItem,
  getPresentBox,
  addPresentItem,
};
