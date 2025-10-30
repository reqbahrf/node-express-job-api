import { FILE_UPLOAD_PURPOSE } from '../../libs/constant/fileUploadPurpose.js';
interface FileUploadConfig {
  purpose: string;
  maxFiles: number;
  allowedTypes?: RegExp | string[];
  maxFileSizeMB?: number;
  storageType: 'temp' | 'public' | 'private';
  destination: string;
}

const ALLOWED_FILES_PURPOSE_CONFIG: FileUploadConfig[] = [
  {
    purpose: FILE_UPLOAD_PURPOSE.DOCUMENT_REGISTRATION,
    maxFiles: 3,
    allowedTypes: /\.(pdf|doc|docx)$/,
    maxFileSizeMB: 10,
    storageType: 'private',
    destination: 'company',
  },
  {
    purpose: FILE_UPLOAD_PURPOSE.COMPANY_LOGO,
    maxFiles: 1,
    allowedTypes: /\.(jpg|png|jpeg)$/,
    maxFileSizeMB: 10,
    storageType: 'private',
    destination: 'company',
  },
];

export default ALLOWED_FILES_PURPOSE_CONFIG;
