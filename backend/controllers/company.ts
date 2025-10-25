import { Request, Response } from 'express';
import CompanyInfo from '../models/CompanyInfo.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';

interface SortOption {
  [key: string]: 1 | -1;
}
interface QueryObject {
  status?: string;
}

const registerCompany = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

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
  const { status, sortBy } = req.query;
  const queryObject: QueryObject = {};
  let sortObject: SortOption = { createdAt: -1 };

  if (status) {
    queryObject.status = status as string;
  }

  if (sortBy) {
    switch (sortBy) {
      case 'oldest':
        sortObject = { createdAt: 1 };
        break;
      case 'newest':
        sortObject = { createdAt: -1 };
        break;
      default:
        break;
    }
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const companies = await CompanyInfo.find(queryObject)
    .populate('employer', 'username email')
    .sort(sortObject)
    .skip(skip)
    .limit(limit);
  res.status(StatusCodes.OK).json({ companies, nbhit: companies.length });
};

export { registerCompany, updateCompanyStatus, getCompanies, getCompany };
