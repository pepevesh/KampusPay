const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authMiddleware = (roles=[]) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, accessTokenSecret);
      req.user = decoded;

      // console.log(req.user);

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access forbidden for your role' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports =  authMiddleware ;
