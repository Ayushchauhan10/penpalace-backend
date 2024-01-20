const User = require('../models/User');
const Blog = require('../models/Blog');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const { uploadImageToCloudinary } = require("../utils/ImageUploader");

const registerController = async (req, res) => {
    // console.log("hello");
    try {

        const { firstName, lastName, accountType = "User", userId, email, password } = req.body;
       

        const userIdInUse = await User.findOne({ userId });
        if (userIdInUse) {
            return res.status(409).json({
                success: false,
                message: "UserId already registered ",
            })
        }

        const emailInUse = await User.findOne({ email });
        if (emailInUse) {
            return res.status(409).json({
                success: false,
                message: "Email already registered ",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userProfile = await User.create({
            firstName, lastName, accountType, userId, email, password: hashedPassword, image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        return res.status(200).json({
            success: true,
            message: "Successfully Registered",
            user: userProfile,
        });

    }
    catch (error) {
        console.log("Error in registering : ", error)
        return res.status(500).json({
            success: false,
            message: "registeration API error",
            error,
        })
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(409).json({
                success: false,
                message: "User does not exist",
            })
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
        }
        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        user.password = undefined;
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token,
        })
    }
    catch (error) {
        console.log("Error in loginnig : ", error)
        return res.status(500).json({
            success: false,
            message: "Login API error",
            error,
        })
    }
}

const updatePasswordController = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id);
        const { oldPassword, newPassword } = req.body;
        
        const correctPassword = await bcrypt.compare(oldPassword, userDetails.password);

        if (!correctPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(req.user.id,
            { password: hashedPassword },
        );

        return res.status(200).json({
            success: true,
            message: "Password Updated successful",
        })

    }
    catch (error) {
        console.log("updateProfile is loginnig : ", error)
        return res.status(500).json({
            success: false,
            message: "updateProfile API error",
            error,
        })
    }
}

const updateProfileController = async (req, res) => {
    try {
       
        const { firstName, lastName, about, mobileNumber, userId } = req.body;
        const id = req.user.id;
        const user = await User.findById(id);

        const userIdinUse = (userId != user.userId) &&
            (await User.findOne({ userId }))

        if (userIdinUse) {
            return res.status(409).json({
                success: false,
                message: "UserId in use",
            });
        }
        const updatedUserDetails = await User.findByIdAndUpdate(id,
            { firstName, lastName, about, mobileNumber, userId },
            { new: true });
            
        updatedUserDetails.password = undefined;
        return res.status(200).json({
            success: true,
            message: "User Details updated successful",
            profile: updatedUserDetails,
        })
    }
    catch (error) {
        console.log("updateProfile error  : ", error)
        return res.status(500).json({
            success: false,
            message: "updateProfile API error",
            error,
        })
    }
}

const getUserProfileController = async (req, res) => {
    try {
        const { id } = req.body;
        const profile = await User.findById(id);
        profile.password = undefined;
        return res.status(200).json({
            success: true,
            message: "Profile fetched successful",
            profile,
        })
    }
    catch (error) {
        console.log("Error in profile api : ", error)
        return res.status(500).json({
            success: false,
            message: "profile API error",
            error,
        })
    }
}
const getAllAuthorConroller = async (req,res) => {
    try {
        const data = await User.find();
        return res.status(200).json({
            success: true,
            message: "All User Fetched Successfully",
            data
        })
    }
    catch (error) {
        console.log("getAllAuthorConroller: " + error);
        return res.status(500).json({
            success: false,
            message: "Error getting all User",
            error
        })
    }
}

const updateProfilePhotoController = async (req, res) => {
    try {
        const { id } = req.user;
        const displayPicture = req.files.displayPicture
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        const profile = await User.findByIdAndUpdate(id, { image: image.secure_url }, { new: true });
        res.send({
            success: true,
            message: `Profile Photo Updated successfully`,
            profile
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading profile photo",
            error: error.message,
        })
    }
};


const getAuthorProfileController = async (req, res) => {
    try {
        const { id } = req.body;
        const profile = await User.findById(id).populate('blog');
        profile.password = undefined;
        return res.status(200).json({
            success: true,
            message: "Author Profile fetched successful",
            profile,
        })
    }
    catch (error) {
        console.log("Error in profile api : ", error)
        return res.status(500).json({
            success: false,
            message: "author profile API error",
            error,
        })
    }
}

module.exports = { registerController, loginController, updatePasswordController, updateProfileController, getUserProfileController, updateProfilePhotoController, getAuthorProfileController ,getAllAuthorConroller}
