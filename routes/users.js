const express = require("express");
const { handleTrash, emptyTrash } = require("../controllers/mailController");

const router = express.Router();

router.post("/users/:id/mails/trash", handleTrash);
router.delete("/users/:id/mails/trash", emptyTrash);

module.exports = router;
