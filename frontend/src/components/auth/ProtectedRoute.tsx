import { useAppSelector } from '@/app/store';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { accessToken, role } = useAppSelector((state) => state.auth);

  if (!accessToken)
    return (
      <Navigate
        to='/login'
        replace
      />
    );

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return (
      <Navigate
        to='/'
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
