const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        maxLength: 25,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        default: "User",
        enum: ["Admin", "User"],
    },
    about: {
        type: String,
        trim: true,
        maxLength: 100,
    },
    mobileNumber: {
        type: String,
        // match: /[/^[0-9]{10}$/,
    },
    blog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        }
    ],
    image: {
        type: String,
        // required: true,
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
    ]
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
