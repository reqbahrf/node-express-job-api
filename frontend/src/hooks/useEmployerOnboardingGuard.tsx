import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '@/features/company/companyAPI';
import { useAppDispatch, useAppSelector } from '@/app/store';

const useEmployerOnboardingGuard = () => {
  const isEmptyObject = (obj: object | null): boolean =>
    obj ? Object.keys(obj).length === 0 : false;
  const dispatch = useAppDispatch();
  const { userid } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (userid) {
      setIsChecking(true);
      dispatch(
        companyAPI.getCompanyInfo({
          companyId: userid!,
        }),
      )
        .unwrap()
        .then((res) => {
          if (isEmptyObject(res.company) && !res.isRegistered) {
            navigate('/employer/company-form', { replace: true });
          } else if (!isEmptyObject(res.company) && !res.isRegistered) {
            navigate('/employer/pending-approval', { replace: true });
          } else {
            setIsChecking(false);
          }
        })
        .catch((e: unknown) => {
          console.log('useEmployerOnboardingGuard', 'catch', e);
          setIsChecking(false);
        });
    } else {
      setIsChecking(false);
    }
  }, [userid, dispatch, navigate]);

  return isChecking;
};

export default useEmployerOnboardingGuard;
