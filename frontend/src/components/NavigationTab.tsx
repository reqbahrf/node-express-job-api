import { useAppSelector } from '@/app/store';
import { Link } from 'react-router-dom';
import { NAVIGATION_TABS } from '@/constant/navigationTabs';
const NavigationTab = () => {
  const role = useAppSelector((state) => state.auth.role);
  const activeView = useAppSelector((state) => state.ui.activeView);
  const navigationTabs =
    NAVIGATION_TABS[role as keyof typeof NAVIGATION_TABS] || [];
  return (
    activeView && (
      <nav className='fixed top-[70px] z-50 flex items-center gap-2'>
        {navigationTabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.link}
            className={`px-4 py-2 text-lg text-black hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${
              activeView === tab.label
                ? 'border-b-2 border-black font-bold dark:border-white'
                : 'font-medium'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    )
  );
};

export default NavigationTab;
