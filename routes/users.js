const express = require("express");
const { moveToTrash, deleteTrash } = require("../controllers/mailController");

const router = express.Router();

router.post("/:id/mails/trash", moveToTrash);
router.delete("/:id/mails/trash", deleteTrash);

module.exports = router;
