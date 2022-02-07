const express = require("express");
const {
  getMailList,
  moveToTrash,
  deleteTrash,
} = require("../controllers/mailController");

const router = express.Router();

router.get("/:id/mails/:inBoxId", getMailList);

router.post("/:id/mails/trash", moveToTrash);

router.delete("/:id/mails/trash", deleteTrash);

module.exports = router;
