const express = require("express");
const { postTrash, deleteTrash } = require("../controllers/mailController");

const router = express.Router();

router.post("/:id/mails/trash", postTrash);
router.delete("/:id/mails/trash", deleteTrash);

module.exports = router;
