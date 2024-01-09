const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const User = require("../models/User");

const createCommentController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, blogId } = req.body;
        if (description.length == 0) {
            return res.status(401).json({
                success: false,
                message: "Comment can't be empty"
            })
        }
        const comment = await Comment.create({ author: userId, description, blog: blogId });

        const blog = await Blog.findByIdAndUpdate(blogId,
            { $push: { comments: comment._id } }, { new: true });

        const user = await User.findByIdAndUpdate(userId,
            { $push: { comments: comment._id } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Comment created successfully",
            user,
            blog
        })
    }
    catch (error) {
        console.log("createCommentController : " + error);
        return res.status(500).json({
            success: false,
            message: "Error creating a comment",
            error
        })
    }
}

const editCommentController = async (req, res) => {
    try {
        const { description, commentId } = req.body;

        const comment = await Comment.findByIdAndUpdate(
            commentId, { description });

        return res.status(200).json({
            success: true,
            message: "Comment edited successfully"
        })
    }
    catch (error) {
        console.log("editCommentController : " + error);
        return res.status(500).json({
            success: false,
            message: "Error editing a comment",
            error
        })
    }
}

const deleteCommentController = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.user.id;
        //Second Mistake
        const comment = await Comment.findById(commentId);
        const blogId = comment.blog;

        await Comment.findByIdAndDelete(commentId);

        await Blog.findByIdAndUpdate(blogId,
            { $pull: { comments: commentId } }, { new: true });

        await User.findByIdAndUpdate(userId,
            { $pull: { comments: commentId } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        })
    }
    catch (error) {
        console.log("editCommentController : " + error);
        return res.status(500).json({
            success: false,
            message: "Error deleting a commenting",
            error
        })
    }
}

const getUserCommentController = async (req, res) => {
    try {
        const { id } = req.body;
        const comments = await Comment.find({ author: id }).sort({ createdAt: -1 }).populate('blog');
        return res.status(200).json({
            success: true,
            message: "UserComments fetched successful",
            comments,
        })
    }
    catch (error) {
        console.log("Error in profile api : ", error)
        return res.status(500).json({
            success: false,
            message: "usercomments API error",
            error,
        })
    }
}

module.exports = { createCommentController, editCommentController, deleteCommentController, getUserCommentController }
