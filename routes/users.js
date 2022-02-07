const express = require("express");
const { postTrash, deleteTrash } = require("../controllers/mailController");

const router = express.Router();
const {
  getMailList,
  moveToTrash,
  deleteTrash,
} = require("../controller/mailController");

router.get("/:id/mails/:inBoxId", getMailList);

router.post("/:id/mails/trash", moveToTrash);

router.delete("/:id/mails/trash", deleteTrash);

module.exports = router;
