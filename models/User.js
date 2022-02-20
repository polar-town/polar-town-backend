const mongoose = require("mongoose");

const guestBookSchema = new mongoose.Schema({
  name: String,
  message: {
    type: String,
    maxLength: 100,
  },
  date: {
    type: String,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
  },
});

const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
});

const itemSchema = new mongoose.Schema({
  purchasedBy: {
    type: String,
  },
  name: {
    type: String,
    enum: ["PolarBear", "Penguin", "Igloo", "Seal", "Flower", "Ice"],
  },
  location: Array,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  cokeCount: {
    type: Number,
    default: 0,
  },
  iceCount: {
    type: Number,
    default: 1,
  },
  photo: {
    type: String,
  },
  friendList: [friendSchema],
  pendingFriendList: [friendSchema],
  guestBook: [guestBookSchema],
  inItemBox: [itemSchema],
  outItemBox: [itemSchema],
  presentBox: [itemSchema],
});

module.exports = mongoose.model("User", userSchema);
