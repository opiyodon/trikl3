'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button, Divider } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '@/components/FuturisticLoader';
import { motion } from 'framer-motion';

const AttachmentCard = ({ attachment }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="mb-4 overflow-hidden bg-gradient-to-br from-white to-gray-100 shadow-lg">
      <CardBody className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-pri">{attachment.position}</h3>
        <p className="text-sm text-gray-600 mb-3">{attachment.companyName} - {attachment.location}</p>
        <Divider className="my-4" />
        <p className="text-sm line-clamp-3 text-gray-700 dark:text-gray-200">{attachment.description}</p>
      </CardBody>
      <CardFooter className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4">
        <p className="text-sm font-semibold text-gray-600">Duration: {attachment.duration} weeks</p>
        <Link href={`/company-dashboard/manage-attachment?id=${attachment._id}`}>
          <Button className="btnPri font-semibold tracking-wide">
            Manage
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

export default function CompanyAttachments() {
  const { data: session, status } = useSession();
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/attachments?companyEmail=${encodeURIComponent(session.user.email)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch attachments');
          }
          const data = await response.json();
          setAttachments(data);
        } catch (error) {
          console.error('Error fetching attachments:', error);
          toast.error('Failed to load attachments. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchAttachments();
    }
  }, [session, status]);

  if (status === 'loading' || isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 md:mb-0">
          Your Attachments
        </h1>
        <Link href="/company-dashboard/post-attachments">
          <Button color="success" size="lg" className="font-bold tracking-wide">
            Post New Attachment
          </Button>
        </Link>
      </motion.div>
      {attachments.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xl text-gray-500 mt-12"
        >
          You haven&apos;t posted any attachments yet.
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {attachments.map((attachment, index) => (
            <motion.div
              key={attachment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AttachmentCard attachment={attachment} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </Container>
  );
}