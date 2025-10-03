import React from 'react';

type DashboardContentProps = {
  children: React.ReactNode;
};

const DashboardContent = ({ children }: DashboardContentProps) => {
  return <div>{children}</div>;
};

export default DashboardContent;
