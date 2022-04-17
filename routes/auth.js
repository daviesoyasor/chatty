const express = require('express')
const router = express.Router()
const { createUser, loginUser, logOut, getMe } = require('../controllers/auth')
const { authenticateToken } = require('../middlewares/auth');

router.route("/register").post(createUser)
router.route("/login").post(loginUser)
router.get('/logout', authenticateToken, logOut);
router.get('/me', authenticateToken, getMe);


module.exports = router;