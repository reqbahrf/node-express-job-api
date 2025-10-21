import axios, { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import getAccessToken from '../../utils/getAccessToken';
import { setLoading } from '../../features/loading/loadingSlice';

interface UploadFileParams {
  fileData: File | FileList;
  purpose: string;
}

interface FileMetaData {
  _id: string;
  filename: string;
  originalname: string;
  purpose: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
  createdBy: string;
}

interface UploadRes {
  msg: string;
  files: Array<FileMetaData>;
}

interface FileError {
  msg: string;
}
const fileAPI = {
  uploadFile: createAsyncThunk(
    'file/upload',
    async (
      {
        fileData,
        purpose,
        onUploadProgress,
      }: UploadFileParams & { onUploadProgress?: (progress: number) => void },
      thunkAPI,
    ) => {
      const formData = new FormData();
      const files =
        fileData instanceof File ? [fileData] : Array.from(fileData);

      files.forEach((file) => {
        formData.append('file', file);
      });

      thunkAPI.dispatch(setLoading({ key: 'fileUpload', loading: true }));

      try {
        const response = await axios.post<UploadRes>(
          `/api/file/upload/${purpose}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total && onUploadProgress) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
                );
                onUploadProgress(progress);
              }
            },
          },
        );

        if (!response.data.files) {
          throw new Error(response.data.msg || 'File upload failed');
        }

        return response.data.files;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : (error as AxiosError<FileError>).response?.data?.msg ||
              'File upload failed';
        return thunkAPI.rejectWithValue(errorMessage);
      } finally {
        thunkAPI.dispatch(setLoading({ key: 'fileUpload', loading: false }));
      }
    },
  ),
  deleteFile: createAsyncThunk('file/delete', async (id: string, thunkAPI) => {
    thunkAPI.dispatch(setLoading({ key: 'fileDelete', loading: true }));
    try {
      const response = await axios.delete(`/api/file/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as AxiosError<FileError>).response?.data?.msg ||
            'File deletion failed';
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading({ key: 'fileDelete', loading: false }));
    }
  }),
};

export default fileAPI;
