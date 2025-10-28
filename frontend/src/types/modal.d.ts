import type { ReactElement } from 'react';
export interface ModalProps<T = any> {
  children: ReactElement<T>;
  size: 'sm' | 'md' | 'full' | 'responsive' | 'md-f-h';
  title: string;
  headerColor?: string;
  onClose: () => void;
}

export interface OpenModalProps {
  children: ReactElement;
  size: 'sm' | 'md' | 'full' | 'responsive' | 'md-f-h';
  title: string;
  headerColor?: string;
  onClose?: () => void;
}
