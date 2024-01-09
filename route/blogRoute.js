const express = require("express");
const router = express.Router()
const { createBlogController, updateBlogController, deleteBlogController, getAllBlogController, userBlogController, viewBlogController, uploadThumbnail } = require("../controller/blogController");
const { auth } = require('../middleware/auth');

router.post('/createBlog', auth, createBlogController);
router.put('/updateBlog', auth, updateBlogController);
router.delete('/deleteBlog', auth, deleteBlogController);
router.get('/getAllBlog', getAllBlogController);
router.post('/userBlog', auth, userBlogController);
router.post('/viewBlog', viewBlogController);
router.put('/uploadThumbnail', auth, uploadThumbnail)
module.exports = router;
