import User from '../models/User.js';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import setTokenCookie from '../utils/auth.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError('Please provide the email and password');
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthenticatedError('Invalide credentials');
  const { accessToken, refreshToken } = user.createJWT();
  setTokenCookie(res, refreshToken);
  res.status(StatusCodes.OK).json({ username: user.name, accessToken });
};
const logout = async (req, res) => {
  res.clearCookie('resToken');
  res.status(StatusCodes.OK).json({ message: 'User logged out' });
};
const register = async (req, res) => {
  const user = await User.create(req.body);
  const { accessToken, refreshToken } = user.createJWT();
  setTokenCookie(res, refreshToken);
  res.status(StatusCodes.CREATED).json({ username: user.name, accessToken });
};

const refreshToken = async (req, res) => {
  const { resToken } = req.cookies;
  console.log(resToken);
  if (!resToken) throw new UnauthenticatedError('Authentication invalid');
  try {
    const decode = jwt.verify(resToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ _id: decode.userId });
    const accessToken = user.generateAccessToken();
    res.status(StatusCodes.OK).json({ username: user.name, accessToken });
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export { login, register, logout, refreshToken };
