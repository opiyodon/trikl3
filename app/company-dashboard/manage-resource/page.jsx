import FuturisticLoader from '@/components/FuturisticLoader';
import dynamic from 'next/dynamic';

const ManageResourceForm = dynamic(() => import('@/components/company/ManageResourceForm'), {
  loading: () => <FuturisticLoader />,
  ssr: false
});

export default function ManageResource() {
  return <ManageResourceForm />;
}
