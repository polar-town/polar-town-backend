const express = require("express");
const router = express.Router();
const {
  getMailList,
  postTrash,
  deleteTrash,
} = require("../controller/mailController");

router.get("/:id/mails/:inBoxId", getMailList);

router.post("/:id/mails/trash", postTrash);

router.delete("/:id/mails/trash", deleteTrash);

module.exports = router;
