import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CompanyInfo from '../models/CompanyInfo.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';

const registerCompany = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== 'employer' || !req.user.userId) {
    throw new UnauthenticatedError('Unauthorized');
  }
  const userId = req.user.userId;

  const existingCompany = await CompanyInfo.findOne({
    employer: userId,
  });

  if (existingCompany) {
    throw new BadRequestError('Company already exists');
  }
  const data = await CompanyInfo.create([
    {
      ...req.body,
      employer: userId,
    },
  ]);
  res.status(StatusCodes.CREATED).json({
    isRegistered: true,
    data: data,
  });
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
