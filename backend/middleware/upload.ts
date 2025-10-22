import multer from 'multer';
import path from 'path';
import { FileUploadError } from './../errors/index.js';
import ALLOWED_FILES_PURPOSE_CONFIG from '../constant/allowedFileConfig.js';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AllowedMimeTypes = string[] | RegExp | undefined;

const _createStorage = (destination: string): multer.StorageEngine => {
  return multer.diskStorage({
    destination,
    filename: function (req, file, cb) {
      cb(
        null,
        `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
      );
    },
  });
};

const _allowedTypeFormater = (regex: RegExp): string => {
  return regex
    .toString()
    .replace('/^\\./', '')
    .replace('/$/i', '')
    .split('|')
    .join(', ');
};

const _createUpload = (
  storageType: 'public' | 'private' | 'temp',
  destination: string,
  allowedMimeTypes: AllowedMimeTypes = /\.(pdf|jpg|jpeg|png|doc|docx)$/,
  maxSizeMB: number
): multer.Multer => {
  const isRegex = allowedMimeTypes instanceof RegExp;

  const basedDes =
    storageType === 'public'
      ? 'storage/app/public'
      : storageType === 'private'
        ? 'storage/app/private'
        : 'storage/app/temps';

  return multer({
    storage: _createStorage(`${basedDes}/${destination}`),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const mime = file.mimetype.toLowerCase();

      const valid = isRegex
        ? allowedMimeTypes?.test(ext)
        : (allowedMimeTypes as string[])?.some(
            (t) => ext === t || mime.includes(t.replace('.', ''))
          );

      if (!valid) {
        const allowedTypes = isRegex
          ? _allowedTypeFormater(allowedMimeTypes)
          : (allowedMimeTypes as string[]).join(', ');

        cb(
          new FileUploadError(
            `Invalid file type. Only ${allowedTypes} files are allowed.`
          )
        );
      }

      cb(null, true);
    },
  });
};

const _uploadMiddlewares = ALLOWED_FILES_PURPOSE_CONFIG.reduce(
  (acc, config) => {
    const middleware = _createUpload(
      config.storageType,
      config.destination,
      config.allowedTypes,
      config.maxFileSizeMB || 10
    );
    const upload =
      config.maxFiles === 1
        ? middleware.single('files')
        : middleware.array('files', config.maxFiles);
    acc[config.purpose] = upload;
    return acc;
  },
  {} as Record<string, RequestHandler>
);

const getUpdateFileMiddleware = _createUpload(
  'temp',
  'uploads',
  /\.(pdf|doc|docx)$/,
  10
).single('file');

const getUploadMiddlewares = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const purpose = req.params.purpose;
  const uploadMiddleware = _uploadMiddlewares[purpose];
  if (!uploadMiddleware) {
    return next(new FileUploadError('File upload failed'));
  }
  return uploadMiddleware(req, res, next);
};

export { getUploadMiddlewares, getUpdateFileMiddleware };
