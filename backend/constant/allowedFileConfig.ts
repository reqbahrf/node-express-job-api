interface FileUploadConfig {
  purpose: string;
  maxFiles: number;
  allowedTypes?: RegExp | string[];
  maxFileSizeMB?: number;
  storageType: 'temp' | 'public' | 'private';
  destination: string;
}

export const PURPOSE = {
  REGISTRATION_DOCS: 'registrationDocs',
};

const ALLOWED_FILES_PURPOSE_CONFIG: FileUploadConfig[] = [
  {
    purpose: PURPOSE.REGISTRATION_DOCS,
    maxFiles: 3,
    allowedTypes: /\.(pdf|doc|docx)$/,
    maxFileSizeMB: 10,
    storageType: 'private',
    destination: 'company',
  },
];

export default ALLOWED_FILES_PURPOSE_CONFIG;
