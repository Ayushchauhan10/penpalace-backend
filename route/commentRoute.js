const express = require("express");
const router = express.Router()
const {
    createCommentController, editCommentController, deleteCommentController, getUserCommentController } = require('../controller/commentController')
const { auth } = require('../middleware/auth');

router.post('/createComment', auth, createCommentController)
router.put('/editComment', auth, editCommentController)
router.delete('/deleteComment', auth, deleteCommentController)
router.post('/userComment', auth, getUserCommentController);
module.exports = router;
