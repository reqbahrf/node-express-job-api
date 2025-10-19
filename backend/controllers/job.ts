import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import { Request, Response } from 'express';

const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await Job.find({ createdBy: req?.user?.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req: Request, res: Response) => {
  if (!req?.user) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Job not found with an ${jobId} id`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req: Request, res: Response) => {
  req.body.createdBy = req?.user?.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req: Request, res: Response) => {
  if (!req?.user) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;
  if (!company || !position) {
    throw new BadRequestError('Please provide company and position');
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) {
    throw new NotFoundError(`Job not found with an ${jobId} id`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req: Request, res: Response) => {
  if (!req?.user) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Job not found with an ${jobId} id`);
  }
  res.status(StatusCodes.OK).send();
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
