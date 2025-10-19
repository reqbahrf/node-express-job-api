import User from '../models/User.js';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import setTokenCookie from '../utils/auth.js';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

interface UserJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError('Please provide the email and password');
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthenticatedError('Invalide credentials');
  const { accessToken, refreshToken } = user.createJWT();
  setTokenCookie(res, refreshToken);
  res.status(StatusCodes.OK).json({
    userid: user._id,
    email: user.email,
    username: user.name,
    role: user.role,
    accessToken,
  });
};
const logout = async (req: Request, res: Response) => {
  res.clearCookie('resToken');
  res.status(StatusCodes.OK).json({ message: 'User logged out' });
};

const register = async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  const { accessToken, refreshToken } = user.createJWT();
  setTokenCookie(res, refreshToken);
  res.status(StatusCodes.CREATED).json({
    userid: user._id,
    email: user.email,
    username: user.name,
    role: user.role,
    accessToken,
  });
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { resToken } = req.cookies;
    console.log(resToken);
    if (!resToken) throw new UnauthenticatedError('Token not found or expired');
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new UnauthenticatedError('Authentication invalid');
    const decode = jwt.verify(resToken, secret) as UserJwtPayload;
    const user = await User.findOne({ _id: decode.userId });
    if (!user) {
      throw new UnauthenticatedError('User not found');
    }
    const accessToken = user.generateAccessToken();
    res.status(StatusCodes.OK).json({
      userid: user._id,
      email: user.email,
      username: user.name,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError('Authentication invalid');
  }
};
export { login, register, logout, refreshToken };
