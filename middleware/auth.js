const JWT = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

exports.auth = async (req, res, next) => {
    try {
        const token = req.body.token || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }
        //verification of token
        try {
            const decode = JWT.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (err) {
            console.log(err)
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
                token
            })
        }
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating token",
        })
    }
}



