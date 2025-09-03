import User from '../models/User.js';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import setTokenCookie from '../utils/auth.js';
import { StatusCodes } from 'http-status-codes';

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
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new UnauthenticatedError('Authentication invalid');
  const user = await User.findOne({ refreshToken });
  if (!user) throw new UnauthenticatedError('Authentication invalid');
  const { accessToken, refreshToken: newRefreshToken } = user.createJWT();
  setTokenCookie(res, newRefreshToken);
  res.status(StatusCodes.OK).json({ username: user.name, accessToken });
};

export { login, register, logout, refreshToken };
