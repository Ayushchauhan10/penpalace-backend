const Blog = require("../models/Blog");
const Like = require("../models/Like");
const User = require("../models/User");

const likeController = async (req, res) => {
    try {
        const { blogId } = req.body;
        const likeBy = req.user.id;
        const like = await Like.create({ likeBy, blog: blogId });

        const user = await User.findByIdAndUpdate(likeBy, { $push: { likes: like._id } },
            { new: true });

        const blog = await Blog.findByIdAndUpdate(blogId, { $push: { likes: like._id } },
            { new: true });

        return res.status(200).json({
            success: true,
            message: 'Liked successfully',
            user,
            blog,
        })

    }
    catch (error) {
        console.log("likeBlog api : " + error);
        return res.status(500).json({
            success: false,
            message: "Error liking a Blog",
            error
        })
    }
}

const dislikeController = async (req, res) => {
    try {
        const { blogId } = req.body;
        const likeBy = req.user.id;
        const like = await Like.findOne({ blog: blogId, likeBy });
        const likeId = like.id;
        await Like.findByIdAndDelete(likeId);

        await User.findByIdAndUpdate(likeBy, { $pull: { likes: likeId } });

        await Blog.findByIdAndUpdate(blogId, { $pull: { likes: likeId } },
            { new: true });

        return res.status(200).json({
            success: true,
            message: 'Disliked successfully',
        })
    }
    catch (error) {
        console.log("likeBlog api : " + error);
        return res.status(500).json({
            success: false,
            message: "Dislike Error",
            error
        })
    }
}

const getUserLikeController = async (req, res) => {
    try {
        const { id } = req.body;
        const likes = await Like.find({ likeBy: id }).sort({ createdAt: -1 }).populate([
            { path: 'blog', populate: { path: 'author' } }
        ]);
        return res.status(200).json({
            success: true,
            message: "Userlikes fetched successful",
            likes,
        })
    }
    catch (error) {
        console.log("Error in profile api : ", error)
        return res.status(500).json({
            success: false,
            message: "userlikes API error",
            error,
        })
    }
}

module.exports = { likeController, dislikeController, getUserLikeController }
