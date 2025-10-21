import axios, { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import getAccessToken from '../../utils/getAccessToken';

interface UploadFileParams {
  file: File;
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
    async ({ file, purpose }: UploadFileParams, thunkAPI) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post<UploadRes>(
          `/api/file/upload/${purpose}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${getAccessToken(thunkAPI)}`,
            },
          },
        );
        return response.data.files;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          (error as AxiosError<FileError>).response?.data?.msg ||
            'File upload failed',
        );
      }
    },
  ),
};

export default fileAPI;
