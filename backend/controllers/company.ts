import { Request, Response } from 'express';
import CompanyInfo from '../models/CompanyInfo.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import { cleanupOnError } from '../utils/cleanupOnError.js';

//Employer
const registerCompany = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  let registrationDocs: string[] = [];
  try {
    if (!req.user || req.user.role !== 'employer') {
      throw new UnauthenticatedError('Unauthorized');
    }

    const existingCompany = await CompanyInfo.findOne({
      employer: req.user.userId,
    });

    if (existingCompany) {
      throw new BadRequestError('Company already exists');
    }

    registrationDocs = files?.map((f) => f.path) || [];

    const data = await CompanyInfo.create({
      ...req.body,
      registrationDocs,
      employer: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({ isRegistered: true, data });
  } catch (error) {
    await cleanupOnError(registrationDocs, error as Error);
    throw error;
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
