const express = require('express')
const { getAllUsers } = require('../controllers/users')
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router()

router.use(authenticateToken);
router.route("/").get(getAllUsers)
// router.route("/:id").get(getSingleUser)


module.exports = router;