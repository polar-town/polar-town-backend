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
  toggleItem,
  changeItemLocation,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id/mails/:inBoxId", getMailList);

router.post("/:id/mails/trash", moveToTrash);

router.delete("/:id/mails/trash", deleteTrash);

router.get("/:id", getUserInfo);

router.get("/:id/guestBook", getGuestBook);

router.post("/:id/guestBook", addMessage);

router.put("/:id/items/:itemId", toggleItem);

router.put("/:id/items/:itemId/location", changeItemLocation);

module.exports = router;
