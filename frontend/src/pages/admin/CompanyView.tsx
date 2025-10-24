import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { companyAPI } from '@/features/company/companyAPI';
import { useState } from 'react';
import CompanyCard from '../../components/company/CompanyCard';
import type { CompanyInfo } from '../../types/company';
import { setActiveView } from '@/features/ui/uiSlice';
import Loading from '@/components/Loading';

const CompanyView = () => {
  const dispatch = useAppDispatch();
  const [companies, setCompanies] = useState<CompanyInfo[]>([]);
  const { getCompanies } = useAppSelector(
    (state) => state.loading.loadingState,
  );
  useEffect(() => {
    dispatch(setActiveView('Companies'));
    dispatch(companyAPI.getCompanies()).unwrap().then(setCompanies);
  }, []);
  if (getCompanies?.loading) return <Loading />;
  return (
    <>
      {companies.length > 0 &&
        companies.map((company) => <CompanyCard company={company} />)}
    </>
  );
};

export default CompanyView;
