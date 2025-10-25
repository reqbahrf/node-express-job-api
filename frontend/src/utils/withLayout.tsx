import { ComponentType, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/store';

const WithLayout = (
  Layout: ComponentType<{ children: ReactNode }>,
  page: ReactNode,
) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  if (!accessToken) return <Navigate to='/login' />;
  return <Layout>{page}</Layout>;
};
export default WithLayout;
