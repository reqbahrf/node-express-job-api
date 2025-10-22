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
    purpose: 'registrationDocs',
    maxFiles: 3,
    allowedTypes: /\.(pdf|doc|docx)$/,
    maxFileSizeMB: 10,
    storageType: 'private',
    destination: 'company',
  },
];

export default ALLOWED_FILES_PURPOSE_CONFIG;
