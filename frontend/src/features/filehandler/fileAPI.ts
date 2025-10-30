import axios, { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import getAccessToken from '../../utils/getAccessToken';
import { setLoading } from '../../features/loading/loadingSlice';
import baseURL from '@/constant/baseURL';

interface UploadFileParams {
  formData: FormData;
  purpose: string;
  onUploadProgress: (progress: number, localId: string) => void;
}

interface FileMetaData {
  serverId: string;
  localId: string;
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
  filesMeta: Array<FileMetaData>;
}

interface FileError {
  msg: string;
}
const fileAPI = {
  uploadFile: createAsyncThunk(
    'file/upload',
    async (
      { formData, purpose, onUploadProgress }: UploadFileParams,
      thunkAPI,
    ) => {
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
            signal: thunkAPI.signal,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total && onUploadProgress) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
                );

                const localIds = formData.getAll('localIds');
                if (onUploadProgress) {
                  localIds.forEach((localId) => {
                    onUploadProgress(progress, localId as string);
                  });
                }
              }
            },
          },
        );

        if (!response.data.filesMeta) {
          throw new Error(response.data.msg || 'File upload failed');
        }

        return response.data.filesMeta;
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
        signal: thunkAPI.signal,
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
  getFile: createAsyncThunk('file/get', async (id: string, thunkAPI) => {
    thunkAPI.dispatch(setLoading({ key: 'fileGet', loading: true }));
    try {
      const response = await axios.get(`/api/file/view/${id}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
        },
        signal: thunkAPI.signal,
        responseType: 'blob',
      });
      return {
        data: response.data,
        mimetype: response.headers['content-type'],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as AxiosError<FileError>).response?.data?.msg ||
            'File not found';
      return thunkAPI.rejectWithValue(errorMessage);
    } finally {
      thunkAPI.dispatch(setLoading({ key: 'fileGet', loading: false }));
    }
  }),
};

export default fileAPI;
