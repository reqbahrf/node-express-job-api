import { Request, Response } from 'express';
import CompanyInfo from '../models/CompanyInfo.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';

//Employer
const registerCompany = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'employer') {
    throw new UnauthenticatedError('Unauthorized');
  }

  const existingCompany = await CompanyInfo.findOne({
    employer: req.user.userId,
  });

  if (existingCompany) {
    throw new BadRequestError('Company already exists');
  }

  await CompanyInfo.create({
    ...req.body,
    employer: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Company registration submitted for approval' });
};

const getCompany = async (req: Request, res: Response) => {
  const company = await CompanyInfo.findById(req.params.id);
  if (!company) {
    throw new NotFoundError('Company not found');
  }
  res.status(StatusCodes.OK).json({ company });
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
