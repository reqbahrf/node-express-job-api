import { ReactElement, cloneElement, Suspense } from 'react';
import { RiCloseLine } from '@remixicon/react';
interface ModalProps<T = any> {
  children: ReactElement<T>;
  title: string;
  headerColor: string;
  onClose: () => void;
}
const MainJobModal = (props: ModalProps) => {
  const { children, title, headerColor, onClose } = props;

  const cloneChildren = cloneElement(children, { onClose });
  return (
    <div
      tabIndex={-1}
      role='dialog'
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto'
      aria-labelledby='modal-title'
      aria-modal='true'
    >
      <div className='modal-overlay absolute inset-0 bg-gray-900 opacity-50' />
      <div className='modal-container bg-white dark:bg-gray-800 md:w-1/3 w-full mx-auto rounded-2xl shadow-lg z-50 pb-4'>
        <div
          className={`flex justify-between items-center p-4 ${headerColor} rounded-t-2xl`}
        >
          <h2 className='text-lg font-bold text-white dark:text-white'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='modal-close font-extrabold text-gray-600 dark:text-white hover:text-gray-900 '
          >
            <RiCloseLine />
          </button>
        </div>
        <div className='modal-body p-4 '>
          {
            <Suspense
              fallback={
                <div className='text-center'>Retrieving the form...</div>
              }
            >
              {cloneChildren}
            </Suspense>
          }
        </div>
      </div>
    </div>
  );
};

export default MainJobModal;
