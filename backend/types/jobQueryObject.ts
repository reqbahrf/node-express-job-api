import { Request } from 'express';
export interface JobQueryRequest {
  page?: string | undefined;
  limit?: string | undefined;
  sort?: string | undefined;
  company?: string | undefined;
  jobType?: string | undefined;
  location?: string | undefined;
  status?: string | undefined;
  salaryRange?: string;
}

export interface JobQueryObject extends JobQueryRequest {
  'salaryRange.min'?: { $gte: number };
  'salaryRange.max'?: { $lte: number };
}

export type JobPostRequest = Request<never, never, never, JobQueryObject>;
