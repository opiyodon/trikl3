import FuturisticLoader from '@/components/FuturisticLoader';
import dynamic from 'next/dynamic';

const PostAttachmentForm = dynamic(() => import('@/components/company/PostAttachmentForm'), {
  loading: () => <FuturisticLoader />,
  ssr: false
});

export default function PostAttachment() {
  return <PostAttachmentForm />;
}