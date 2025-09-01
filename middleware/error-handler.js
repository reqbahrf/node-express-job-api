import { StatusCodes } from 'http-status-codes';
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    errCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    errMsg: err.message || 'Something went wrong, please try again later',
  };
  if (err.code || err.code === 11000) {
    customError.errCode = StatusCodes.BAD_REQUEST;
    customError.errMsg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }
  return res.status(customError.errCode).json({ msg: customError.errMsg });
};

export default errorHandlerMiddleware;
