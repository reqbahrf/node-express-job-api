import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { CustomError } from '../errors/index.js';
const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response
) => {
  const customError = {
    errCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    errMsg: err.message || 'Something went wrong, please try again later',
  };
  if (err.name === 'ValidationError') {
    customError.errCode = StatusCodes.BAD_REQUEST;
    customError.errMsg = Object.values(err.errors || {})
      .map((error) => error.message)
      .join(',');
  }
  if (err.name === 'CastError') {
    customError.errMsg = `No item found with id: ${err.value}`;
    customError.errCode = StatusCodes.NOT_FOUND;
  }
  if (err.code === 11000 && err.keyValue) {
    customError.errCode = StatusCodes.BAD_REQUEST;
    customError.errMsg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }
  // res.status(customError.errCode).json({ err });
  res.status(customError.errCode).json({ msg: customError.errMsg });
};

export default errorHandlerMiddleware;
