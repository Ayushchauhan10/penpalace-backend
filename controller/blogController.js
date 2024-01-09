const { default: mongoose } = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

const createBlogController = async (req, res) => {
    try {

        const { title, category, thumbnail, shortDescription, longDescription } = req.body;
        const author = req.user.id;
        const blog = await Blog.create({ title, category, thumbnail, shortDescription, longDescription, author });

        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { blog: blog._id } });

        return res.status(200).json({
            success: true,
            message: "Blog created successfully",
        })

    }
    catch (error) {
        console.log("CreateBlog api : ", error);
        return res.status(500).json({
            success: false,
            message: "Error creating Blog",
            error
        })
    }
}

const updateBlogController = async (req, res) => {
    try {
        const { title, category, thumbnail, shortDescription, longDescription, blogId } = req.body;
        const author = req.user.id;

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { title, category, thumbnail, shortDescription, longDescription }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        })
    }
    catch (error) {
        console.log("updateBlog api : " + error);
        return res.status(500).json({
            success: false,
            message: "Error updating Blog",
            error
        })
    }
}

const deleteBlogController = async (req, res) => {
    try {
        const { blogId } = req.body;
        const author = req.user.id;

        await Blog.findByIdAndDelete(blogId);

        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { blog: blogId } }
        );

        const likesToDelete = await Like.find({ blog: blogId });
        for (const like of likesToDelete) {
            const userId = like.likeBy._id;
            await User.findByIdAndUpdate(userId, { $pull: { likes: like._id } });
        }
        await mongoose.model('Like').deleteMany({ blog: blogId });

        const commentsToDelete = await Comment.find({ blog: blogId });
        for (const comment of commentsToDelete) {
            const userId = comment.author._id;
            await User.findByIdAndUpdate(userId, { $pull: { comments: comment._id } });
        }

        await Comment.deleteMany({ blog: blogId });


        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        })
    }
    catch (error) {
        console.log("deleteBlog api : " + error);
        return res.status(500).json({
            success: false,
            message: "Error deleting Blog",
            error
        })
    }
}

const getAllBlogController = async (req, res) => {
    try {
        const data = await Blog.find().sort({ createdAt: -1 }).populate('author');
        return res.status(200).json({
            success: true,
            message: "All Blogs Fetched Successfully",
            data
        })
    }
    catch (error) {
        console.log("getAllBlogController: " + error);
        return res.status(500).json({
            success: false,
            message: "Error getting all Blog",
            error
        })
    }
}

const userBlogController = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "User Blogs Fetched Successfully",
            blogs
        })
    }
    catch (error) {
        console.log("userBlogController: " + error);
        return res.status(500).json({
            success: false,
            message: "Error getting user specific all Blog",
            error
        })
    }
}

const viewBlogController = async (req, res) => {
    try {
        const id = req.body;
        const objectId = new mongoose.Types.ObjectId(id);
        let data = await Blog.findById(objectId).populate([{
            path: 'author', select: 'firstName lastName image'
        },
        {
            path: 'comments',
            populate: [
                { path: 'author', model: 'User', select: 'firstName lastName image' },
            ],
            options: { sort: { updatedAt: -1 } },
        }
        ]).exec();

        return res.status(200).json({
            success: true,
            message: "Particular Blogs Fetched Successfully",
            data,
        })
    }
    catch (error) {
        console.log("viewBlogController: " + error);
        return res.status(500).json({
            success: false,
            message: "Error getting particular Blog",
            error
        })
    }
}


const uploadThumbnail = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        res.send({
            success: true,
            message: `Thumbnail Updated successfully`,
            thumbnail: image.secure_url
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: error.message,
        })
    }
};

module.exports = { createBlogController, updateBlogController, deleteBlogController, getAllBlogController, userBlogController, viewBlogController, uploadThumbnail }
