import React, { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  title: string;
  headerColor: string;
  onClose: () => void;
}
const MainModal = (props: ModalProps) => {
  const { children, title, headerColor, onClose } = props;
  return (
    <div
      tabIndex={-1}
      role='dialog'
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto'
      aria-labelledby='modal-title'
      aria-modal='true'
    >
      <div className='modal-overlay absolute inset-0 bg-gray-900 opacity-50' />
      <div className='modal-container bg-white md:w-1/3 w-full mx-auto rounded-2xl shadow-lg z-50 pb-4'>
        <div
          className={`flex justify-between items-center p-4 ${headerColor} rounded-t-2xl`}
        >
          <h2 className='text-lg font-bold text-white'>{title}</h2>
          <button
            onClick={onClose}
            className='modal-close font-extrabold text-gray-600 hover:text-gray-900 '
          >
            x
          </button>
        </div>
        <div className='modal-body p-4 '>{children}</div>
      </div>
    </div>
  );
};

export default MainModal;
