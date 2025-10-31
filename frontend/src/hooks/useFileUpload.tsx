import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/app/store';
import fileAPI from '@/features/filehandler/fileAPI';
import FileInput from '@/components/FileInput';
import { FILE_UPLOAD_PURPOSE } from '@/../../libs/constant/fileUploadPurpose';

export interface FileUploadStatus {
  localId: string;
  serverId: string;
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
}

export interface FilesUploadState {
  [key: FileUploadPurpose]: FileUploadStatus[];
}
interface FileUploadConfig {
  multiple: boolean;
  accept: string;
  id: string;
  name: string;
  purpose: FileUploadPurpose;
}

export type FileUploadPurpose =
  (typeof FILE_UPLOAD_PURPOSE)[keyof typeof FILE_UPLOAD_PURPOSE];

export const useFileUpload = () => {
  const dispatch = useAppDispatch();
  const [uploadingFilesStatus, setUploadingFilesStatus] =
    useState<FilesUploadState>({});

  const uploadingLogic = async (
    filesState: FileUploadStatus[],
    purpose: FileUploadPurpose,
  ) => {
    const formData = new FormData();
    filesState.forEach((file) => {
      formData.append('files', file.file);
      formData.append('localIds', file.localId);
    });
    try {
      const resultAction = await dispatch(
        fileAPI.uploadFile({
          formData,
          purpose,
          onUploadProgress: (progress, localId) => {
            setUploadingFilesStatus((prev) => ({
              ...prev,
              [purpose]: prev[purpose].map((item) =>
                item.localId === localId ? { ...item, progress } : item,
              ),
            }));
          },
        }),
      );

      if (fileAPI.uploadFile.fulfilled.match(resultAction)) {
        const uploadedFiles = resultAction.payload;
        setUploadingFilesStatus((prev) => ({
          ...prev,
          [purpose]: prev[purpose].map((item) => {
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
        }));
      } else if (fileAPI.uploadFile.rejected.match(resultAction)) {
        const error = resultAction.payload as string;
        setUploadingFilesStatus((prev) => ({
          ...prev,
          [purpose]: prev[purpose].map((item) => ({
            ...item,
            status: 'error' as const,
            error: error || 'Upload failed',
          })),
        }));
        toast.error(`Upload failed: ${error}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    purpose: FileUploadPurpose,
  ) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      localId: Math.random().toString(36).substring(2, 15),
      serverId: '',
      file,
      progress: 0,
      status: 'uploading' as const,
    }));
    try {
      setUploadingFilesStatus((prev) => ({
        ...prev,
        [purpose]: [...(prev[purpose] ? prev[purpose] : []), ...newFiles],
      }));

      await uploadingLogic(newFiles, purpose);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An unexpected error occurred during file upload');
    }
  };

  const handleReTryUpload = async (
    localId: string,
    purpose: FileUploadPurpose,
  ) => {
    try {
      const file = uploadingFilesStatus[purpose].find(
        (f) => f.localId === localId,
      );
      if (!file) {
        throw new Error('File not found');
      }

      setUploadingFilesStatus((prev) => ({
        ...prev,
        [purpose]: prev[purpose].map((item) =>
          item.localId === localId
            ? { ...item, status: 'uploading' as const, progress: 0 }
            : item,
        ),
      }));
      await uploadingLogic([file], purpose);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An unexpected error occurred during file upload');
    }
  };

  const handleRemoveFile = async (
    serverId: string | null,
    localId: string,
    purpose: FileUploadPurpose,
  ) => {
    if (!serverId && localId) {
      setUploadingFilesStatus((prev) => ({
        ...prev,
        [purpose]: prev[purpose].filter((f) => f.localId !== localId),
      }));
      return;
    } else if (serverId && localId) {
      const resultAction = await dispatch(fileAPI.deleteFile(serverId));
      if (fileAPI.deleteFile.fulfilled.match(resultAction)) {
        setUploadingFilesStatus((prev) => ({
          ...prev,
          [purpose]: prev[purpose].filter((f) => f.serverId !== serverId),
        }));
      }
    }
  };

  const createFileInput = (config: FileUploadConfig) => {
    return (
      <FileInput
        multiple={config.multiple}
        accept={config.accept}
        id={config.id}
        name={config.name}
        handlers={{
          purpose: config.purpose,
          uploadingFilesStatus,
          handleFileChange,
          handleReTryUpload,
          handleRemoveFile,
        }}
      />
    );
  };

  return {
    uploadingFilesStatus,
    createFileInput,
  };
};
