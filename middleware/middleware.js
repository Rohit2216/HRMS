const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklistModel");

const verifyUserToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ status: false, message: "Token missing." });
        }

        // Check if token is blacklisted
        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) {
            return res.status(403).json({ status: false, message: "Your session has expired. Please log in again to continue." });
        }

        // Verify JWT
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: false, message: "Invalid or expired token" });
            }
            req.user = decoded;
            next();
        });

    } catch (error) {
        res.status(403).json({ status: false, message: "Token verification failed", error: error.message });
    }
};

module.exports = verifyUserToken;
