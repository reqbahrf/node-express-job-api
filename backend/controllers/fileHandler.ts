import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { rootDir } from '../utils/pathResolver.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import File from '../models/File.js';
import { cleanupOnError } from '../utils/cleanupOnError.js';

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
  // const session = await mongoose.startSession();
  // session.startTransaction();

  const purpose = req.params.purpose;
  const userId = req.user?.userId;
  const singleFile = req.file as Express.Multer.File | undefined;
  const multipleFiles = req.files as Express.Multer.File[] | undefined;
  const localIds = req.body.localIds as string[] | string | undefined;

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

    const localIdsArray = Array.isArray(localIds)
      ? localIds
      : localIds
        ? [localIds]
        : [];

    if (localIdsArray.length !== uploadedFiles.length) {
      throw new BadRequestError(
        'Number of files does not match number of localId'
      );
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

    const fileDocs = await File.create(filesMetaData);
    createdFileIds = fileDocs.map((f) => f._id.toString());

    const response = fileDocs.map((doc, index) => ({
      serverId: doc._id,
      localId: localIdsArray[index],
      filename: doc.filename,
      originalname: doc.originalname,
      purpose: doc.purpose,
      mimetype: doc.mimetype,
      size: doc.size,
      path: doc.path,
      url: doc.url,
      createdBy: doc.createdBy,
    }));
    // await session.commitTransaction();

    return res.status(StatusCodes.CREATED).json({
      msg: 'Files uploaded successfully.',
      filesMeta: response,
    });
  } catch (error) {
    // await session.abortTransaction();

    await cleanupOnError(
      filesMetaData.map((f) => f.path),
      createdFileIds,
      error as Error
    );

    throw error;
    // } finally {
    // await session.endSession();
    // if (session.inTransaction()) {
    //   await session.abortTransaction();
    // }
  }
};

const updateFile = async (req: Request, res: Response) => {
  const {
    params: { id },
    user,
  } = req;
  const file = (req.file as Express.Multer.File) || null;

  if (!file) {
    throw new BadRequestError('Please upload a file.');
  }

  const oldFile = await File.findById(id);

  if (!oldFile) {
    throw new NotFoundError('Old file not found.');
  }
  if (!user?.isOwner(oldFile?.createdBy.toString())) {
    throw new UnauthenticatedError(
      'Unauthorized: Your are not allowed to update this file.'
    );
  }

  const absoluteOldPath = path.join(rootDir, oldFile.path);
  const oldDir = path.dirname(absoluteOldPath);
  const newFileName = `${Date.now()}-${file.filename}`;
  const newAbsolutePath = path.join(oldDir, newFileName);
  const newRelativePath = path.relative(rootDir, newAbsolutePath);
  await fs.promises.rename(file.path, newAbsolutePath);

  if (fs.existsSync(absoluteOldPath)) {
    await fs.promises.unlink(absoluteOldPath);
  }

  oldFile.path = newRelativePath;
  oldFile.filename = newFileName;
  oldFile.mimetype = file.mimetype;
  oldFile.size = file.size;
  oldFile.originalname = file.originalname;
  await oldFile.save();

  return res.status(StatusCodes.OK).json({
    msg: 'File updated successfully.',
    file: {
      filename: newFileName,
      path: newRelativePath,
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname,
    },
  });
};

const deleteFile = async (req: Request, res: Response) => {
  const {
    params: { id },
    user,
  } = req;

  if (!id) {
    throw new BadRequestError('File id is required.');
  }

  const file = await File.findById(id);

  if (!file) {
    throw new NotFoundError('File not found.');
  }
  if (!user?.isOwner(file?.createdBy.toString())) {
    throw new UnauthenticatedError(
      'Unauthorized: Your are not allowed to delete this file.'
    );
  }

  const absolutePath = path.join(process.cwd(), file.path);

  if (fs.existsSync(absolutePath)) {
    await fs.promises.unlink(absolutePath);
    await file.deleteOne();
    return res
      .status(StatusCodes.OK)
      .json({ msg: 'File deleted successfully.' });
  }

  throw new NotFoundError('File not found.');
};

const viewFile = async (req: Request, res: Response) => {
  const {
    params: { id },
    user,
  } = req;

  const file = await File.findById(id);

  if (!file) {
    throw new NotFoundError('File not found.');
  }

  if (
    !user?.isOwner(file?.createdBy.toString()) &&
    !user?.isAllowedToAccess(['admin'])
  ) {
    throw new UnauthenticatedError(
      'Unauthorized: Your are not allowed to view this file.'
    );
  }

  const absolutePath = path.join(rootDir, file.path);

  if (fs.existsSync(absolutePath)) {
    return res.status(StatusCodes.OK).sendFile(absolutePath);
  }

  throw new NotFoundError('File not found.');
};

export { uploadFiles, updateFile, deleteFile, viewFile };
