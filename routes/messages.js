const express = require('express')
const { getAllMessages, createMessage } = require('../controllers/messages')
const router = express.Router()
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken);

router.route("/:roomId").get(getAllMessages)
router.route("/").post(createMessage)
// router.route("/:id").get(getSingleUser)


module.exports = router;