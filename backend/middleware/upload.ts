import multer from 'multer';
import fs from 'fs';
import path from 'path';

type AllowedMimeTypes = string[] | RegExp;

const _createStorage = (destination: string): multer.StorageEngine => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      fs.mkdirSync(destination, { recursive: true });
      cb(null, destination);
    },
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

const createUpload = (
  baseDestination: 'public' | 'private' | 'temp',
  destination: string,
  allowedMimeTypes: AllowedMimeTypes
): multer.Multer => {
  const isRegex = allowedMimeTypes instanceof RegExp;

  const basedDes =
    baseDestination === 'public'
      ? 'storage/app/public'
      : baseDestination === 'private'
        ? 'storage/app/private'
        : 'storage/app/temp';

  return multer({
    storage: _createStorage(`${basedDes}/${destination}`),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const mime = file.mimetype.toLowerCase();

      const valid = isRegex
        ? allowedMimeTypes.test(ext)
        : (allowedMimeTypes as string[]).some(
            (t) => ext === t || mime.includes(t.replace('.', ''))
          );

      if (valid) return cb(null, true);

      const readable =
        isRegex && allowedMimeTypes instanceof RegExp
          ? _allowedTypeFormater(allowedMimeTypes)
          : (allowedMimeTypes as string[]).join(', ');
      cb(new Error(`Invalid file type. Only ${readable} files are allowed.`));
    },
  });
};

export default createUpload;
