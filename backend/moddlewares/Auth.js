const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']; // Directly take the token


    if (!token) {
        return res.status(403).json({ message: "Unauthorized, JWT token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to req
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, JWT token is invalid or expired" });
    }
};

module.exports = ensureAuthenticated;
