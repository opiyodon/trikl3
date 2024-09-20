import FuturisticLoader from '@/components/FuturisticLoader';
import dynamic from 'next/dynamic';

const ManageAttachmentForm = dynamic(() => import('@/components/company/ManageAttachmentForm'), {
  loading: () => <FuturisticLoader />,
  ssr: false
});

export default function ManageAttachment() {
  return <ManageAttachmentForm />;
}