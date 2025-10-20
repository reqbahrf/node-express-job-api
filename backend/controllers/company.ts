import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CompanyInfo from '../models/CompanyInfo.js';
import File from '../models/File.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import { cleanupOnError } from '../utils/cleanupOnError.js';

export interface FileInfo {
  filename: string;
  originalname: string;
  purpose: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

const registerCompany = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const files = req.files as Express.Multer.File[] | undefined;
  let registrationDocs: Array<FileInfo> = [];
  let createdFileIds: string[] = [];

  try {
    if (!req.user || req.user.role !== 'employer') {
      throw new UnauthenticatedError('Unauthorized');
    }
    const userId = req.user.userId;

    const existingCompany = await CompanyInfo.findOne({
      employer: userId,
    }).session(session);

    if (existingCompany) {
      throw new BadRequestError('Company already exists');
    }

    registrationDocs =
      files?.map((f) => ({
        filename: f.filename,
        originalname: f.originalname,
        purpose: 'registrationDocs',
        mimetype: f.mimetype,
        size: f.size,
        path: f.path,
        url: f.path,
        createdBy: userId,
      })) || [];

    const fileDocs = await File.create(registrationDocs, { session });
    createdFileIds = fileDocs.map((doc) => doc._id.toString());

    const data = await CompanyInfo.create(
      [
        {
          ...req.body,
          registrationDocs: createdFileIds,
          employer: userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(StatusCodes.CREATED).json({
      isRegistered: true,
      data: data[0],
    });
  } catch (error) {
    await session.abortTransaction();

    await cleanupOnError(
      registrationDocs.map((f) => f.path),
      createdFileIds,
      error as Error
    );
  } finally {
    await session.endSession();
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
  }
};

const getCompany = async (req: Request, res: Response) => {
  const { id } = req.params;
  const company = await CompanyInfo.findOne({
    employer: id,
  });
  if (!company) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: 'Company not found or not registered, please register first',
      isRegistered: false,
    });
  }

  const isRegistered = company.status === 'approved';
  res.status(StatusCodes.OK).json({ company, isRegistered });
};

const updateCompanyStatus = async (req: Request, res: Response) => {
  const {
    params: id,
    body: { status },
  } = req;

  if (!['approved', 'rejected'].includes(status)) {
    throw new BadRequestError('Invalid status');
  }

  const company = await CompanyInfo.findById(id);

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  company.status = status;
  await company.save();

  res.status(StatusCodes.OK).json({ msg: `Company ${status}` });
};

const getCompanies = async (req: Request, res: Response) => {
  const {
    query: { status },
  } = req;
  const companies = await CompanyInfo.find({ status }).populate(
    'employer',
    'username email'
  );
  res.status(StatusCodes.OK).json({ companies });
};

export { registerCompany, updateCompanyStatus, getCompanies, getCompany };
