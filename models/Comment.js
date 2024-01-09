const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
