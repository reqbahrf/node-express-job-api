import JobPost from '../models/JobPost.js';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { JobPostRequest, JobQueryObject } from '../types/jobQueryObject.js';

//For Applicant
const getAllJobPosts = async (req: JobPostRequest, res: Response) => {
  const { sort, company, jobType, location, status, salaryRange } = req.query;
  const queryObject: JobQueryObject = {};

  if (company) {
    queryObject.company = company;
  }

  if (jobType) {
    queryObject.jobType = jobType;
  }

  if (location) {
    queryObject.location = location;
  }

  if (status) {
    queryObject.status = status;
  }

  if (salaryRange) {
    const [min, max] = salaryRange.split('-').map(Number);
    queryObject['salaryRange.min'] = { $gte: min };
    queryObject['salaryRange.max'] = { $lte: max };
  }

  let result = JobPost.find(queryObject);

  if (sort) {
    result = result.sort(sort.split(',').join(' '));
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const jobs = await result;

  res.status(StatusCodes.OK).json({
    nbHits: jobs.length,
    data: jobs,
  });
};

//For Employer
const createJobPost = async (req: JobPostRequest, res: Response) => {
  const jobPost = await JobPost.create(req.body);
  res.status(StatusCodes.CREATED).json(jobPost);
};

//For Employer
const updateJobPost = async (req: Request, res: Response) => {
  const jobPost = await JobPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json(jobPost);
};

//For Employer
const markAsClosed = async (req: Request, res: Response) => {
  const jobPost = await JobPost.findByIdAndUpdate(
    req.params.id,
    { status: 'closed' },
    {
      new: true,
    },
  );
  res.status(StatusCodes.OK).json(jobPost);
};

//For Applicant
const applyJobPost = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  const jobPost = await JobPost.findByIdAndUpdate(id, {
    $push: {
      applicants: {
        applicantId: req.user?.userId,
        appliedAt: new Date(),
        status: 'pending',
      },
    },
  });
  res.status(StatusCodes.OK).json(jobPost);
};

export {
  getAllJobPosts,
  createJobPost,
  updateJobPost,
  markAsClosed,
  applyJobPost,
};
