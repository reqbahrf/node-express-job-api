import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';

//TODO:Refactor for File model implementation

const uploadFiles = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'No files uploaded.' });
  }

  const filePaths = files.map((f) => ({
    filename: f.filename,
    path: f.path,
  }));

  return res.status(StatusCodes.CREATED).json({
    msg: 'Files uploaded successfully.',
    files: filePaths,
  });
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
