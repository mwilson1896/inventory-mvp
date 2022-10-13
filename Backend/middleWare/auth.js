const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401)
            throw new Error ('Not authorized, no token')
        }

        // verify
        const verify = jwt.verify(token, process.env.JWT_SECRET);

        //get user id token
        const user = await User.findById(verify.id).select('-password');

        if (!user) {
            return res.status(401)
            throw new Error ('Not authorized, no user')
        }
        req.user = user;
        next();
    }catch (err) {
        res.status(401)
        throw new Error('Not authorized, token failed')
    }
});

module.exports = protect;