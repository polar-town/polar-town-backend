const express = require("express");
const {
  getMailList,
  moveToTrash,
  deleteTrash,
} = require("../controllers/mailController");

const {
  getInItemBox,
  addInItem,
  getPresentBox,
  addPresentItem,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id/mails/:inBoxId", getMailList);

router.post("/:id/mails/trash", moveToTrash);

router.delete("/:id/mails/trash", deleteTrash);

router.get("/:id/items", getInItemBox);

router.post("/:id/items", addInItem);

router.get("/:id/items/present", getPresentBox);

router.post(":id/items/present", addPresentItem);

module.exports = router;
