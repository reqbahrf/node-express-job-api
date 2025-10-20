import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  RiUploadLine,
  RiBriefcaseLine,
  RiUserLine,
  RiMapPinLine,
  RiGlobeLine,
  RiMailLine,
  RiPhoneLine,
  RiImageLine,
  RiFileTextLine,
  RiCloseLine,
} from '@remixicon/react';
import Input from '@/components/Input';
import { setLoading } from '../../loading/loadingSlice';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveView } from '@/features/ui/uiSlice';

interface CompanyInfoFormState {
  companyName: string;
  ceoName: string;
  industry: string;
  address: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  registrationDocs: File[];
}

const CompanyInfoForm = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<CompanyInfoFormState>({
    companyName: '',
    ceoName: '',
    industry: '',
    address: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: '',
    registrationDocs: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      registrationDocs: [
        ...prev.registrationDocs,
        ...Array.from(e.target.files as FileList),
      ],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      registrationDocs: prev.registrationDocs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dispatchPayload = { key: 'companyForm', loading: true };
    dispatch(setLoading(dispatchPayload));

    try {
      const data = new FormData();
      (Object.keys(formData) as (keyof CompanyInfoFormState)[]).forEach(
        (key) => {
          if (key !== 'registrationDocs') {
            data.append(key, formData[key] as string);
          }
        },
      );

      // Handle file uploads
      if (formData.registrationDocs) {
        Array.from(formData.registrationDocs).forEach((file) => {
          data.append('registrationDocs', file);
        });
      }

      await toast.promise(
        axios.post('/api/v1/company/register-company', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          loading: 'Submitting company info...',
          success: 'Company registered successfully!',
          error: (err) =>
            err.response?.data?.message || 'Failed to submit company info',
        },
      );
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
                value={formData.companyName}
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
                value={formData.ceoName}
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
                value={formData.industry}
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
                value={formData.address}
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
                value={formData.website}
                onChange={handleChange}
                placeholder='Website (optional)'
                className='w-full pl-10'
              />
            </div>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiMailLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='email'
                name='contactEmail'
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder='Contact Email'
                className='w-full pl-10'
                required
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
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder='Contact Number'
                className='w-full pl-10'
                required
              />
            </div>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <RiImageLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='url'
                name='logoUrl'
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder='Logo URL (optional)'
                className='w-full pl-10'
              />
            </div>
          </div>
          <div className='mt-2'>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Registration Documents
            </label>
            <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-600'>
              <div className='space-y-1 text-center'>
                <RiFileTextLine className='mx-auto h-12 w-12 text-gray-400' />
                <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                  <label
                    htmlFor='registrationDocs'
                    className='relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500 dark:bg-gray-700'
                  >
                    <span>Upload files</span>
                    <input
                      id='registrationDocs'
                      name='registrationDocs'
                      type='file'
                      multiple
                      accept='.pdf,.jpg,.png,.jpeg,.doc,.docx'
                      onChange={handleFileChange}
                      className='sr-only'
                    />
                  </label>
                  <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>
            </div>
          </div>
          {formData.registrationDocs &&
            formData.registrationDocs.length > 0 && (
              <ul className='mt-3 text-sm text-gray-700 dark:text-gray-300'>
                {Array.from(formData.registrationDocs).map((file, index) => (
                  <li key={index} className='flex items-center justify-between'>
                    <span>{file.name}</span>
                    <div className='flex items-center'>
                      <span className='text-xs text-gray-400'>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type='button'
                        onClick={() => handleRemoveFile(index)}
                        className='ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      >
                        <RiCloseLine />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          <div className='pt-4'>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              Submit Company Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
