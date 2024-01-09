const express = require("express");
const router = express.Router()
const { auth } = require('../middleware/auth');
const { likeController, dislikeController, getUserLikeController, isLikedController } = require('../controller/likeController');

router.post('/likeBlog', auth, likeController);
router.post('/dislikeBlog', auth, dislikeController);
router.post('/userLike', auth, getUserLikeController);

module.exports = router;
