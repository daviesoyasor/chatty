const express = require('express')
const router = express.Router()
const { createRoom, getNameOfRoom, getAllMembersOfRoom } = require('../controllers/room')
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken);

router.route("/:RoomId").get(getAllMembersOfRoom)
router.route("/room-name/:RoomId").get(getNameOfRoom)
router.route("/").post(createRoom)



module.exports = router;