const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    category: {
        type: String,
        required: true,
        maxLength: 60,
    },
    thumbnail: {
        type: String,
        // required: true,
    },
    shortDescription: {
        type: String,
        trim: true,
    },
    longDescription: {
        type: String,
        trim: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like",
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
