const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    // Extract the Authorization header
    const authHeader = req.headers['authorization'];
    
    console.log('Authorization Header:', authHeader); // Debugging

    // Check if the authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header provided' });
    }

    // Validate the Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Malformed authorization header' });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            // Check if token is expired or invalid
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                return res.status(500).json({ message: 'Authentication error' });
            }
        }

        // Attach user info to the request object
        req.user = user;
        console.log('Decoded User:', user); // Debugging to check the decoded user info

        // Proceed to the next middleware/route handler
        next();
    });
};

module.exports = authMiddleware;
