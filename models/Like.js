const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    likeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    { timestamps: true }
);
likeSchema.index({ blog: 1, likeBy: 1 }, { unique: true });
module.exports = mongoose.model("Like", likeSchema);
