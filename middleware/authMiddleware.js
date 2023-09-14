const jwt = require('jsonwebtoken');
const User = require('../models/userTable');

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        code: 'Invalid-Token',
        error: 'Please provide a valid JWT token',
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(authorization, secretKey);
    } catch (error) {
      return res.status(401).json({
        code: 'Unauthorized',
        error: 'Invalid token or token expired',
      });
    }
    const existUser = await User.findByPk(decodedToken.userId);

    if (!existUser) {
      return res
        .status(401)
        .json({ code: 'Unauthorized', error: 'User does not exist' });
    }

    req.User = existUser;
    next();
    return res.status(200);
  } catch (error) {
    console.error(error.toString());
    return res.status(401).json({ code: 'Unauthorized', error: error.message });
  }
};

module.exports = authMiddleware;
