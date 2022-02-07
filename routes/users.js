const express = require("express");
const router = express.Router();
const {
  getMailList,
  moveToTrash,
  deleteTrash,
} = require("../controller/mailController");

router.get("/:id/mails/:inBoxId", getMailList);

router.post("/:id/mails/trash", moveToTrash);

<<<<<<< HEAD
router.delete("/:id/mails/trash", deleteTrash);
=======
router.post("/:id/mails/trash", handleTrash);
router.delete("/:id/mails/trash", emptyTrash);
>>>>>>> 2eec934 (chore: revised endpoint of users route)

module.exports = router;
