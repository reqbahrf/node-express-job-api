import { useState, useCallback, ReactElement } from 'react';
import Modal from '../components/Modal';

interface UseModalReturn {
  modal: ReactElement | null;
  openModal: (
    children: ReactElement,
    size: 'sm' | 'md' | 'full' | 'responsive',
    title: string,
    headerColor?: string | undefined,
    onClose?: () => void,
  ) => void;
  closeModal: () => void;
}

const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalHeaderColor, setModalHeaderColor] = useState('');
  const [size, setSize] = useState<'sm' | 'md' | 'full' | 'responsive'>('md');
  const [onCloseCallback, setOnCloseCallback] = useState<
    (() => void) | undefined
  >(undefined);

  const openModal = useCallback(
    (
      children: ReactElement,
      size: 'sm' | 'md' | 'full' | 'responsive',
      title: string,
      headerColor?: string | undefined,
      onClose?: () => void,
    ) => {
      setSize(size);
      setModalContent(children);
      setModalTitle(title);
      setModalHeaderColor(headerColor || 'bg-white dark:bg-gray-950');
      setOnCloseCallback(() => {
        return () => {
          setIsOpen(false);
          if (onClose) {
            onClose();
          }
        };
      });
      setIsOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
    setModalTitle('');
    setModalHeaderColor('');
    setOnCloseCallback(undefined);
  }, []);

  const modal = isOpen ? (
    <Modal
      children={modalContent!}
      size={size}
      title={modalTitle}
      headerColor={modalHeaderColor}
      onClose={onCloseCallback || closeModal}
    />
  ) : null;

  return { modal, openModal, closeModal };
};

export default useModal;
