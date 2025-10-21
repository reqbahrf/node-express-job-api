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
import toast from 'react-hot-toast';
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
  const [uploadingFilesStatus, setUploadingFilesStatus] = useState<
    {
      serverId: string;
      file: File;
      progress: number;
      status: 'idle' | 'uploading' | 'completed' | 'error';
    }[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCompanyFormData((prev) => ({ ...prev, [name]: value }));
  };

  //FIXME: function fail to handle multiple files it fail to update the currect file with its server id.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      serverId: '',
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadingFilesStatus((prev) => [...prev, ...newFiles]);

    try {
      const resultAction = await dispatch(
        fileAPI.uploadFile({
          fileData: e.target.files,
          purpose: 'registrationDocs',
          onUploadProgress: (progress) => {
            setUploadingFilesStatus((prev) =>
              prev.map((item, idx) =>
                idx >= prev.length - files.length
                  ? { ...item, progress }
                  : item,
              ),
            );
          },
        }),
      );

      if (fileAPI.uploadFile.fulfilled.match(resultAction)) {
        const uploadedFiles = resultAction.payload;
        setUploadingFilesStatus((prev) =>
          prev.map((item, idx) => ({
            ...item,
            status: 'completed' as const,
            serverId: uploadedFiles[idx]?._id || '',
            progress: 100,
          })),
        );
      } else if (fileAPI.uploadFile.rejected.match(resultAction)) {
        const error = resultAction.payload as string;
        setUploadingFilesStatus((prev) =>
          prev.map((item) => ({
            ...item,
            status: 'error' as const,
            error: error || 'Upload failed',
          })),
        );
        toast.error(`Upload failed: ${error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An unexpected error occurred during file upload');
    } finally {
      // Clear file input
      e.target.value = '';
    }
  };

  //TODO: need testing
  const handleRemoveFile = async (serverid: string) => {
    const resultAction = await dispatch(fileAPI.deleteFile(serverid));
    if (fileAPI.deleteFile.fulfilled.match(resultAction)) {
      setUploadingFilesStatus((prev) =>
        prev.filter((f) => f.serverId !== serverid),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dispatchPayload = { key: 'companyForm', loading: true };
    dispatch(setLoading(dispatchPayload));

    try {
      const formData = {
        ...companyFormData,
        registrationDocs: uploadingFilesStatus.map((f) => f.serverId),
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
                      disabled={uploadingFilesStatus.some(
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
                {uploadingFilesStatus.length > 0 && (
                  <div className='mt-4 space-y-2 text-left'>
                    {uploadingFilesStatus.map((upload, index) => (
                      <div key={index} className='text-sm'>
                        <div className='flex items-center justify-between'>
                          <span className='truncate'>{upload.file.name}</span>
                          <div className='flex items-center'>
                            <span className='text-xs text-gray-400'>
                              {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <button
                              type='button'
                              onClick={() => {
                                handleRemoveFile(upload.serverId);
                              }}
                              className='ml-2 text-red-500 hover:text-red-700'
                              disabled={upload.status === 'uploading'}
                            >
                              <RiCloseLine className='h-4 w-4' />
                            </button>
                          </div>
                        </div>
                        <div className='mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                          <div
                            className={`h-full ${
                              upload.status === 'completed'
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
                          {upload.status === 'completed' &&
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
          {/* {registrationFiles && registrationFiles.length > 0 && (
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
          )} */}
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
