import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import mongoose from 'mongoose';
import File from '../models/File.js';
import { cleanupOnError } from '../utils/cleanupOnError.js';

//TODO:Refactor for File model implementation
export interface FileInfo {
  filename: string;
  originalname: string;
  purpose: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
  createdBy: string;
}

const uploadFiles = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const purpose = req.params.purpose;
  const userId = req.user?.userId;
  const singleFile = req.file as Express.Multer.File | undefined;
  const multipleFiles = req.files as Express.Multer.File[] | undefined;

  let filesMetaData: FileInfo[] = [];
  let createdFileIds: string[] = [];

  try {
    const uploadedFiles: Express.Multer.File[] = multipleFiles?.length
      ? multipleFiles
      : singleFile
        ? [singleFile]
        : [];

    if (uploadedFiles.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'No files uploaded.' });
    }

    if (!userId) {
      throw new UnauthenticatedError('Unauthorized');
    }

    filesMetaData = uploadedFiles.map((f) => ({
      filename: f.filename,
      originalname: f.originalname,
      purpose,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
      createdBy: userId,
    }));

    const fileDocs = await File.create(filesMetaData, { session });
    createdFileIds = fileDocs.map((f) => f._id.toString());

    await session.commitTransaction();

    return res.status(StatusCodes.CREATED).json({
      msg: 'Files uploaded successfully.',
      files: fileDocs,
    });
  } catch (error) {
    await session.abortTransaction();

    await cleanupOnError(
      filesMetaData.map((f) => f.path),
      createdFileIds,
      error as Error
    );

    throw error;
  } finally {
    await session.endSession();
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
  }
};

const updateFile = async (req: Request, res: Response) => {
  const { oldFilePath } = req.body;
  const file = (req.file as Express.Multer.File) || null;

  if (!file) {
    throw new BadRequestError('File is required.');
  }
  if (!oldFilePath) {
    throw new BadRequestError('Old file path is required.');
  }

  const absoluteOldPath = path.join(process.cwd(), oldFilePath);
  if (fs.existsSync(absoluteOldPath)) {
    fs.unlinkSync(absoluteOldPath);
  }

  const newPath = file.path;
  const fileUrl = `/storage/${path.relative('storage/app/public', newPath)}`;

  return res.status(StatusCodes.OK).json({
    msg: 'File updated successfully.',
    file: { filename: file.filename, path: newPath, url: fileUrl },
  });
};

const deleteFile = async (req: Request, res: Response) => {
  const { filePath } = req.body;

  if (!filePath) {
    throw new BadRequestError('File path is required.');
  }

  const absolutePath = path.join(process.cwd(), filePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    return res
      .status(StatusCodes.OK)
      .json({ msg: 'File deleted successfully.' });
  }

  throw new NotFoundError('File not found.');
};

const viewFile = async (req: Request, res: Response) => {
  const { type, fileName } = req.params;

  const basePath =
    type === 'public' ? 'storage/app/public' : 'storage/app/private';
  if (!fileName) {
    throw new BadRequestError('File name is required.');
  }

  const absolutePath = path.join(process.cwd(), basePath, fileName);

  if (fs.existsSync(absolutePath)) {
    return res.status(StatusCodes.OK).sendFile(absolutePath);
  }

  throw new NotFoundError('File not found.');
};

export { uploadFiles, updateFile, deleteFile, viewFile };
