const jwt = require('jsonwebtoken');
const JWT_SECRET = "arjunambavanesecretkey";

async function auth(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith("Bearer ") 
                    ? authHeader.split(" ")[1] 
                    : authHeader;

    if (token) {
        try {
            const { userId } = jwt.verify(token, JWT_SECRET);
            req.userId = userId;
            next();
        } catch (e) {
            return res.status(401).json({
                type: "error",
                msg: "Invalid or expired token",
                error: e.message
            });
        }
    } else {
        return res.status(401).json({
            type: "error",
            msg: "Token not provided"
        });
    }
}

module.exports = auth;