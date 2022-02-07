const express = require("express");
const { handleTrash, emptyTrash } = require("../controllers/mailController");

const router = express.Router();

router.post("/:id/mails/trash", handleTrash);
router.delete("/:id/mails/trash", emptyTrash);

module.exports = router;
