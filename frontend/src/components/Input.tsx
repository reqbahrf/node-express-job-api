import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  styleType?: 'combined' | 'custom';
  className?: string;
};
const Input = ({ className, styleType = 'combined', ...props }: InputProps) => {
  const defaultStyles =
    styleType === 'combined'
      ? `p-2 rounded-md border text-black dark:text-white border-gray-300 dark:border-gray-600 ${className}`
      : '';
  return (
    <input
      {...props}
      className={`${defaultStyles} ${className} w-full text-black dark:text-white`}
    />
  );
};

export default Input;
