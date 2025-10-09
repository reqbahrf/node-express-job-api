import { UnauthenticatedError, BadRequestError } from '../errors/index.js';
import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
const changePassword = async (req: Request, res: Response) => {
  if (!req?.user) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const { newPassword, currentPassword, confirmPassword } = req.body;
  if (!newPassword || !currentPassword || !confirmPassword) {
    throw new BadRequestError('Please provide the password');
  }
  if (newPassword !== confirmPassword) {
    throw new BadRequestError('Passwords do not match');
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) throw new UnauthenticatedError('Authentication invalid');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new UnauthenticatedError('Invalide credentials');
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: 'Password changed successfully',
  });
};
export { changePassword };
