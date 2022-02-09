const express = require("express");
const {
  getMailList,
  moveToTrash,
  deleteTrash,
} = require("../controllers/mailController");

const {
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
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUserInfo);

router.get("/:id/mails/:inBoxId", getMailList);

router.post("/:id/mails/trash", moveToTrash);

router.delete("/:id/mails/trash", deleteTrash);

router.get("/:id/guestBook", getGuestBook);

router.post("/:id/guestBook", addMessage);

router.put("/:id/items/:itemId", changeItemStorage);

router.put("/:id/items/:itemId/location", changeItemLocation);

router.get("/:id/items", getInItemBox);

router.post("/:id/items", addInItem);

router.get("/:id/items/present", getPresentBox);

router.post("/:id/items/present", addPresentItem);

router.get("/:id/friends", getFriendList);

router.delete("/:id/friends", deleteFriend);

router.get("/:id/friends/pending", getPendingFriendList);

router.post("/:id/friends/pending", addPendingFriendList);

module.exports = router;
