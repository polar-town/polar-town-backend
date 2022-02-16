const express = require("express");
const {
  getMailList,
  moveToTrash,
  deleteTrash,
} = require("../controllers/mailController");

const {
  getSearchResult,
  getUserInfo,
  getGuestBook,
  addMessage,
  checkNewGuestBook,
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
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getSearchResult);

router.get("/:id", getUserInfo);

router.get("/:id/mails/:inBoxId/:pageToken", getMailList);

router.post("/:id/mails/trash", moveToTrash);

router.delete("/:id/mails/trash", deleteTrash);

router.get("/:id/guestBook", getGuestBook);

router.post("/:id/guestBook", addMessage);

router.put("/:id/guestBook", checkNewGuestBook);

router.put("/:id/items/:itemId", changeItemStorage);

router.put("/:id/items/:itemId/location", changeItemLocation);

router.post("/:id/friends", acceptFriendRequest);

router.get("/:id/items", getInItemBox);

router.post("/:id/items", addInItem);

router.get("/:id/items/present", getPresentBox);

router.post("/:id/items/present", addPresentItem);

router.get("/:id/friends", getFriendList);

router.delete("/:id/friends", deleteFriend);

router.get("/:id/friends/pending", getPendingFriendList);

router.post("/:id/friends/pending", addPendingFriendList);

router.delete("/:id/friends/pending", deletePendingFriendList);

module.exports = router;
