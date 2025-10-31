import { useEffect, useState } from 'react';
import {
  RiBriefcaseLine,
  RiUserLine,
  RiMapPinLine,
  RiGlobeLine,
  RiMailLine,
  RiPhoneLine,
  RiImageLine,
} from '@remixicon/react';
import Input from '@/components/Input';
import { FILE_UPLOAD_PURPOSE } from '@/../../libs/constant/fileUploadPurpose';
import { setLoading } from '../../loading/loadingSlice';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveView } from '@/features/ui/uiSlice';
import { companyAPI } from '../../company/companyAPI';
import { Link } from 'react-router-dom';
import { useFileUpload } from '@/hooks/useFileUpload';

export interface CompanyInfoFormState {
  companyName: string;
  ceoName: string;
  industry: string;
  address: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  logo: string;
  registrationDocs: string[];
}

const CompanyInfoForm = () => {
  const isRegistered = useAppSelector((state) => state.company.isRegistered);
  const dispatch = useAppDispatch();
  const [companyFormData, setCompanyFormData] = useState<CompanyInfoFormState>({
    companyName: '',
    ceoName: '',
    industry: '',
    address: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    logo: '',
    registrationDocs: [],
  });
  const { uploadingFilesStatus, createFileInput } = useFileUpload();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCompanyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dispatchPayload = { key: 'companyForm', loading: true };
    dispatch(setLoading(dispatchPayload));

    try {
      const formData = {
        ...companyFormData,
        logo: uploadingFilesStatus[FILE_UPLOAD_PURPOSE.COMPANY_LOGO][0]
          .serverId,
        registrationDocs: uploadingFilesStatus[
          FILE_UPLOAD_PURPOSE.DOCUMENT_REGISTRATION
        ].map((f) => f.serverId),
      };
      await dispatch(companyAPI.registerCompany({ formData }));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  };

  useEffect(() => {
    dispatch(setActiveView(''));
  }, []);
  return (
    <div className='mx-auto max-w-3xl p-6'>
      <div className='rounded-lg bg-white p-6 shadow-md md:p-8 dark:bg-gray-800'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
            Company Registration
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-300'>
            Please fill in your company details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiBriefcaseLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='text'
                name='companyName'
                value={companyFormData.companyName}
                onChange={handleChange}
                placeholder='Company Name'
                className='w-full pl-10'
                required
              />
            </div>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiUserLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='text'
                name='ceoName'
                value={companyFormData.ceoName}
                onChange={handleChange}
                placeholder='CEO Name'
                className='w-full pl-10'
                required
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiBriefcaseLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='text'
                name='industry'
                value={companyFormData.industry}
                onChange={handleChange}
                placeholder='Industry Type'
                className='w-full pl-10'
                required
              />
            </div>
            <div className='relative'>
              <div className='absolute top-3 left-3'>
                <RiMapPinLine className='h-5 w-5 text-gray-400' />
              </div>
              <textarea
                name='address'
                value={companyFormData.address}
                onChange={handleChange}
                placeholder='Company Address'
                rows={3}
                required
                className='w-full rounded-md border border-gray-300 p-2 pl-10 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiGlobeLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='url'
                name='website'
                value={companyFormData.website}
                onChange={handleChange}
                placeholder='Website (optional)'
                className='w-full pl-10'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiPhoneLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='tel'
                name='contactPhone'
                value={companyFormData.contactPhone}
                onChange={handleChange}
                placeholder='Contact Number'
                className='w-full pl-10'
                required
              />
            </div>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiMailLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='email'
                name='contactEmail'
                value={companyFormData.contactEmail}
                onChange={handleChange}
                placeholder='Contact Email'
                className='w-full pl-10'
                required
              />
            </div>
          </div>
          <div className='mt-2'>
            <label className='text-md mb-2 block font-medium text-gray-700 dark:text-gray-300'>
              Company Logo
            </label>
            {createFileInput({
              multiple: false,
              accept: '.jpg,.png,.jpeg',
              id: 'logoUrl',
              name: 'logoUrl',
              purpose: FILE_UPLOAD_PURPOSE.COMPANY_LOGO,
            })}
          </div>
          <div className='mt-2'>
            <label className='text-md mb-2 block font-medium text-gray-700 dark:text-gray-300'>
              Registration Documents
            </label>
            {createFileInput({
              multiple: true,
              accept: '.pdf,.jpg,.png,.jpeg,.doc,.docx',
              id: 'registrationDocs',
              name: 'registrationDocs',
              purpose: FILE_UPLOAD_PURPOSE.DOCUMENT_REGISTRATION,
            })}
          </div>
          <div className='pt-4'>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              Submit Company Information
            </button>
            {isRegistered && (
              <Link
                to='/employer/dashboard'
                className='mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400'
              >
                Go back to dashboard
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
