import { cloneElement, Suspense } from 'react';
import { RiCloseLine } from '@remixicon/react';
import type { ModalProps } from '@/types/modal';

const Modal: React.FC<ModalProps> = (props) => {
  const { children, size, title, headerColor, onClose } = props;

  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'min-w-[50vw] max-w-[50vw] min-h-[30vh] max-h-[30vh]';
      break;
    case 'md':
      sizeClass = 'min-w-[70vw] max-w-[70vw] min-h-[50vh] max-h-[50vh]';
      break;
    case 'md-f-h':
      sizeClass = 'min-w-[70vw] max-w-[70vw] min-h-full max-h-full';
      break;
    case 'full':
      sizeClass = 'min-w-full max-w-full min-h-full max-h-full';
      break;
    case 'responsive':
      sizeClass =
        'w-full h-full max-w-full max-h-full md:max-w-[50vw] md:max-h-[90vh]';
      break;
    default:
      break;
  }

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
      <div
        className={`relative ${sizeClass} overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800`}
      >
        <div
          className={`flex items-center justify-between p-4 ${headerColor || 'bg-white dark:bg-gray-950'} rounded-t-2xl`}
        >
          <h2 className='text-lg font-bold text-black dark:text-white'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='modal-close font-extrabold text-gray-600 hover:text-gray-900 dark:text-white'
          >
            <RiCloseLine />
          </button>
        </div>
        <div className='modal-body min-h-full p-4'>
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

export default Modal;
