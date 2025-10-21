import { useEffect, useState } from 'react';
import {
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
import { companyAPI } from '../companyAPI';
import { Link } from 'react-router-dom';
import fileAPI from '@/features/filehandler/fileAPI';

export interface CompanyInfoFormState {
  companyName: string;
  ceoName: string;
  industry: string;
  address: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  registrationDocs: string[];
}

const CompanyInfoForm = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
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
    logoUrl: '',
    registrationDocs: [],
  });
  const [registrationFiles, setRegistrationFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<
    {
      file: File;
      progress: number;
      status: 'idle' | 'uploading' | 'success' | 'error';
    }[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCompanyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const newUploads = files.map((file) => ({
      file,
      progress: 0,
      status: 'idle' as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploads]);
    const uploadPromises = newUploads.map(async (upload, index) => {
      const fileIndex = uploadingFiles.length + index;

      try {
        setUploadingFiles((prev) => {
          const updated = [...prev];
          updated[fileIndex] = { ...updated[fileIndex], status: 'uploading' };
          return updated;
        });

        const result = await dispatch(
          fileAPI.uploadFile({
            file: upload.file,
            purpose: 'registrationDocs',
          }),
        ).unwrap();

        setRegistrationFiles((prev) => [...prev, upload.file]);

        setUploadingFiles((prev) => {
          const updated = [...prev];
          updated[fileIndex] = { ...updated[fileIndex], status: 'success' };
          return updated;
        });

        setCompanyFormData((prev) => ({
          ...prev,
          registrationDocs: [
            ...prev.registrationDocs,
            ...result.map((f) => f._id),
          ],
        }));
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadingFiles((prev) => {
          const updated = [...prev];
          updated[fileIndex] = { ...updated[fileIndex], status: 'error' };
          return updated;
        });
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      // Individual file errors are handled above
      console.error('Some files failed to upload');
    }
  };

  const handleRemoveFile = (index: number) => {
    setRegistrationFiles((prev) => prev.filter((_, i) => i !== index));
    setCompanyFormData((prev) => ({
      ...prev,
      registrationDocs: prev.registrationDocs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dispatchPayload = { key: 'companyForm', loading: true };
    dispatch(setLoading(dispatchPayload));

    try {
      const formData = {
        ...companyFormData,
      };
      await dispatch(companyAPI.registerCompany({ formData, accessToken }));
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
                <RiImageLine className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='url'
                name='logoUrl'
                value={companyFormData.logoUrl}
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
              <div className='w-full space-y-4 text-center'>
                <RiFileTextLine className='mx-auto h-12 w-12 text-gray-400' />
                <div className='flex justify-center text-sm text-gray-600 dark:text-gray-400'>
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
                      disabled={uploadingFiles.some(
                        (f) => f.status === 'uploading',
                      )}
                    />
                  </label>
                  <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  PDF, JPG, PNG up to 10MB
                </p>

                {/* Upload progress */}
                {uploadingFiles.length > 0 && (
                  <div className='mt-4 space-y-2 text-left'>
                    {uploadingFiles.map((upload, index) => (
                      <div key={index} className='text-sm'>
                        <div className='flex items-center justify-between'>
                          <span className='truncate'>{upload.file.name}</span>
                          <button
                            type='button'
                            onClick={() => {
                              setUploadingFiles((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                              setRegistrationFiles((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                            }}
                            className='ml-2 text-red-500 hover:text-red-700'
                            disabled={upload.status === 'uploading'}
                          >
                            <RiCloseLine className='h-4 w-4' />
                          </button>
                        </div>
                        <div className='mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                          <div
                            className={`h-full ${
                              upload.status === 'success'
                                ? 'bg-green-500'
                                : upload.status === 'error'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                            }`}
                            style={{
                              width: `${upload.status === 'uploading' ? upload.progress : 100}%`,
                              transition: 'width 0.3s ease-in-out',
                            }}
                          />
                        </div>
                        <div className='mt-1 text-xs text-gray-500'>
                          {upload.status === 'uploading' && 'Uploading...'}
                          {upload.status === 'success' &&
                            'Uploaded successfully'}
                          {upload.status === 'error' && 'Upload failed'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {registrationFiles && registrationFiles.length > 0 && (
            <ul className='mt-3 text-sm text-gray-700 dark:text-gray-300'>
              {Array.from(registrationFiles).map((file, index) => (
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
