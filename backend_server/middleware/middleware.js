const jwt = require('jsonwebtoken');

// Middleware function to validate token
function authenticateToken(req, res, next) {
    // Extract token from headers, query parameters, cookies, etc.
    const token = req.headers.authorization.split(" ")[1];
  
    // Verify token
    if (!token) {
      return res.status(401).json({ "Message": 'Unauthorized User' });
    }
  
    // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ "Message": 'Forbidden: Invalid token, Please Try Again' });
    }
    // Token is valid, proceed to the next middleware
    next();
  });
  }
  
  //export the middleware
  module.exports = {
    authenticateToken
  };