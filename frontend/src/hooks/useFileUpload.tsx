import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/app/store';
import fileAPI from '@/features/filehandler/fileAPI';
import FileInput from '@/components/FileInput';

export interface FileUploadStatus {
  localId: string;
  serverId: string;
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
}

interface FileUploadConfig {
  multiple: boolean;
  accept: string;
  id: string;
  name: string;
}

export const useFileUpload = (purpose: string) => {
  const dispatch = useAppDispatch();
  const [uploadingFilesStatus, setUploadingFilesStatus] = useState<
    FileUploadStatus[]
  >([]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      const files = Array.from(e.target.files);
      const newFiles = files.map((file) => ({
        localId: Math.random().toString(36).substring(2, 15),
        serverId: '',
        file,
        progress: 0,
        status: 'uploading' as const,
      }));

      setUploadingFilesStatus((prev) => [...prev, ...newFiles]);

      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append('files', file.file);
        formData.append('localIds', file.localId);
      });
      try {
        const resultAction = await dispatch(
          fileAPI.uploadFile({
            formData,
            purpose,
            onUploadProgress: (progress, localId) => {
              setUploadingFilesStatus((prev) =>
                prev.map((item) =>
                  item.localId === localId ? { ...item, progress } : item,
                ),
              );
            },
          }),
        );

        if (fileAPI.uploadFile.fulfilled.match(resultAction)) {
          const uploadedFiles = resultAction.payload;
          setUploadingFilesStatus((prev) =>
            prev.map((item) => {
              const uploadedFile = uploadedFiles.find(
                (uf) => uf.localId === item.localId,
              );

              return uploadedFile
                ? {
                    ...item,
                    status: 'completed' as const,
                    serverId: uploadedFile.serverId,
                    progress: 100,
                  }
                : item;
            }),
          );
        } else if (fileAPI.uploadFile.rejected.match(resultAction)) {
          const error = resultAction.payload as string;
          setUploadingFilesStatus((prev) =>
            prev.map((item) => ({
              ...item,
              status: 'error' as const,
              error: error || 'Upload failed',
            })),
          );
          toast.error(`Upload failed: ${error}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('An unexpected error occurred during file upload');
      } finally {
        // Clear file input
        e.target.value = '';
      }
    },
    [],
  );

  const handleRemoveFile = useCallback(async (serverId: string) => {
    const resultAction = await dispatch(fileAPI.deleteFile(serverId));
    if (fileAPI.deleteFile.fulfilled.match(resultAction)) {
      setUploadingFilesStatus((prev) =>
        prev.filter((f) => f.serverId !== serverId),
      );
    }
  }, []);

  const createFileInput = (config: FileUploadConfig) => {
    return (
      <FileInput
        multiple={config.multiple}
        accept={config.accept}
        id={config.id}
        name={config.name}
        handlers={{
          uploadingFilesStatus,
          handleFileChange,
          handleRemoveFile,
        }}
      />
    );
  };

  return {
    uploadingFilesStatus,
    handleFileChange,
    handleRemoveFile,
    createFileInput,
  };
};
