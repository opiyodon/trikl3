import dynamic from 'next/dynamic';
import FuturisticLoader from '@/components/FuturisticLoader';

const ApplyForm = dynamic(() => import('@/components/ApplyForm'), {
  loading: () => <FuturisticLoader />,
  ssr: false
});

export default function Apply() {
  return <ApplyForm />;
}