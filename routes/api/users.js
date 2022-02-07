const express = require("express");
const router = express.Router();
const mailController = require("../controller/mailController");

router.get("/:id/mails/:inBoxId", mailController.getMailList);

router.post("/:id/mails/trash", mailController.postTrash);

router.delete("/:id/mails/trash", mailController.deleteTrash);

module.exports = router;
