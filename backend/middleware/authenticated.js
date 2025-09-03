import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const jwtToken = token.split('Bearer ')[1];
  try {
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = { userId: decode.userId, name: decode.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export default auth;
