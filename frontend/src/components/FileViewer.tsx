import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/store';
import fileAPI from '../features/filehandler/fileAPI';
import Loading from './Loading';

interface FileViewerProps {
  fileId: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileId }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<{ data: Blob; mimetype: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  console.log('mimetype', data?.mimetype);
  console.log('data', data?.data);
  console.log('rendered');

  useEffect(() => {
    if (fileId) {
      setLoading(true);
      dispatch(fileAPI.getFile(fileId))
        .unwrap()
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [fileId, dispatch]);

  useEffect(() => {
    if (data && data.data) {
      const url = URL.createObjectURL(data.data);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className='text-red-500'>Error loading file: {error}</div>;
  }

  if (!fileUrl) {
    return <div>No file to display</div>;
  }

  const renderFile = () => {
    if (!data?.mimetype) return <div>Unable to determine file type</div>;

    const mime = data.mimetype.toLowerCase();

    if (mime.startsWith('image/')) {
      return (
        <img src={fileUrl} alt='File content' className='h-auto max-w-full' />
      );
    } else if (mime === 'application/pdf') {
      return (
        <iframe src={fileUrl} className='h-96 w-full' title='PDF Viewer' />
      );
    } else {
      return <div>File type not supported for display: {mime}</div>;
    }
  };

  return <div className='file-viewer'>{renderFile()}</div>;
};

export default FileViewer;
