const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.SECRET;

const UserAuth = async (req, res, next) => {
    console.log('UserAuth middleware');
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET);
        // console.log('decoded: ', decoded);
        const user = await UserModel.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error();
        }

        req.userId = user._id;
        req.token = token;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Authentication failed.' });
    }
};

module.exports = UserAuth;
