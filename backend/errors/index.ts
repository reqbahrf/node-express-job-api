import CustomAPIError from './custom-api.js';
import UnauthenticatedError from './unauthenticated.js';
import NotFoundError from './not-found.js';
import BadRequestError from './bad-request.js';
import FileUploadError from './file-upload.js';
import type { CustomError } from './error.d.js';

export {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  FileUploadError,
};
export type { CustomError };
