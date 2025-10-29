import React from 'react';
import { RiFileTextLine, RiCloseLine } from '@remixicon/react';
import type { FileUploadStatus } from '@/hooks/useFileUpload';

interface FileInputProps {
  multiple: boolean;
  accept: string;
  id: string;
  name: string;
  handlers: {
    uploadingFilesStatus: FileUploadStatus[];
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFile: (serverId: string) => void;
  };
}

const FileInput: React.FC<FileInputProps> = ({
  multiple,
  accept,
  id,
  name,
  handlers: { uploadingFilesStatus, handleFileChange, handleRemoveFile },
}) => {
  return (
    <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-600'>
      <div className='w-full space-y-4 text-center'>
        <RiFileTextLine className='mx-auto h-12 w-12 text-gray-400' />
        <div className='flex justify-center text-sm text-gray-600 dark:text-gray-400'>
          <label
            htmlFor={id}
            className='relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500 dark:bg-gray-700'
          >
            <span>Upload files</span>
            <input
              id={id}
              name={name}
              type='file'
              multiple={multiple}
              accept={accept}
              onChange={handleFileChange}
              className='sr-only'
              disabled={uploadingFilesStatus.some(
                (f) => f.status === 'uploading',
              )}
            />
          </label>
          <p className='pl-1'>or drag and drop</p>
        </div>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          {`${accept}, max 10MB`}
        </p>

        {/* Upload progress */}
        {uploadingFilesStatus.length > 0 && (
          <div className='mt-4 space-y-2 text-left'>
            {uploadingFilesStatus.map((upload, index) => (
              <div key={index} className='text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='truncate'>{upload.file.name}</span>
                  <div className='flex items-center'>
                    <span className='text-xs text-gray-400'>
                      {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      type='button'
                      onClick={() => {
                        handleRemoveFile(upload.serverId);
                      }}
                      className='ml-2 text-red-500 hover:text-red-700'
                      disabled={upload.status === 'uploading'}
                    >
                      <RiCloseLine className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <div className='mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                  <div
                    className={`h-full ${
                      upload.status === 'completed'
                        ? 'bg-green-500'
                        : upload.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${upload.status === 'uploading' ? upload.progress : 100}%`,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  />
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  {upload.status === 'uploading' && 'Uploading...'}
                  {upload.status === 'completed' && 'Uploaded successfully'}
                  {upload.status === 'error' && 'Upload failed'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;
