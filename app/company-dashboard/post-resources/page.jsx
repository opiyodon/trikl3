import FuturisticLoader from '@/components/FuturisticLoader';
import dynamic from 'next/dynamic';

const PostResourceForm = dynamic(() => import('@/components/company/PostResourceForm'), {
  loading: () => <FuturisticLoader />,
  ssr: false
});

export default function PostResource() {
  return <PostResourceForm />;
}