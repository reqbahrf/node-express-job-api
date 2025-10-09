import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};
const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={`p-2 rounded-md border text-black dark:text-white border-gray-300 dark:border-gray-600 ${className} w-full`}
    />
  );
};

export default Input;
