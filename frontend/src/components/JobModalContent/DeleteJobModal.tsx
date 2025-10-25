import { useAppDispatch, useAppSelector } from '../../app/store';
import { setLoading } from '../../features/loading/loadingSlice';
import jobAPI from '../../features/job/jobAPI';
import toast from 'react-hot-toast';
interface DeleteJobModalProps {
  jobID: string;
  companyName: string;
  status: string;
  position: string;
  onClose?: () => void;
}
const DeleteJobModal = (props: DeleteJobModalProps) => {
  const dispatch = useAppDispatch();
  const { jobID, companyName, status, position, onClose } = props;
  const isLoading = useAppSelector(
    (state) => state.loading.loadingState?.deleteJob?.loading,
  );
  const handleDelete = async (JobId: string) => {
    const dispatchPayload = { key: 'deleteJob', loading: true };
    dispatch(setLoading(dispatchPayload));
    try {
      await dispatch(jobAPI.deleleJob(JobId));
      toast.success('Job deleted successfully');
      onClose?.();
    } catch (error) {
      toast.error(`Failed to delete job: ${error}`);
    } finally {
      dispatch(setLoading({ ...dispatchPayload, loading: false }));
    }
  };
  return (
    <>
      <p>
        Are you sure you want to delete this job for{' '}
        <span className='font-bold'>{companyName}</span> -{' '}
        <span className='font-bold'>{position}</span> with a current status{' '}
        <span className='font-bold'>{status}</span>?
      </p>
      <div className='flex justify-end gap-2'>
        <button
          onClick={() => handleDelete(jobID)}
          disabled={isLoading}
          className='rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600'
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={onClose}
          className='rounded-md bg-gray-500 px-3 py-1 text-white hover:bg-gray-600'
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default DeleteJobModal;
