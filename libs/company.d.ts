export interface CompanyInfo {
  _id?: string;
  employer: string;
  companyName: string;
  ceoName: string;
  industry: string;
  address: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  registrationDocs: Array<{
    _id: string;
    originalname: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QueryParams {
  company?: string;
  status?: string;
  sortby?: string;
  page?: string;
}

export interface CompanyState {
  company: CompanyInfo | null;
  isRegistered: boolean;
}
