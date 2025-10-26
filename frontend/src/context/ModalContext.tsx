import React, { createContext, useContext, ReactElement } from 'react';
import useModal from '../hooks/useModal'; // Import the useModal hook

interface ModalContextType {
  openModal: (
    children: ReactElement,
    size: 'sm' | 'md' | 'full' | 'responsive',
    title: string,
    headerColor?: string | undefined,
    onClose?: () => void,
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { modal, openModal, closeModal } = useModal();

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal}
      {/* Render the modal here, it will be controlled by the context */}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
