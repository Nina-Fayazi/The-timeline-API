const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_super_secret_key_here';

module.exports = (req, res, next) => {
    const token = req.cookies.token;

   
    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please log in first." });
    }

    try {
       
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(401).json({ message: "Session expired. Please log in again." });
    }
};