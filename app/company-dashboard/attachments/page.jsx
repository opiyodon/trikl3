'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttachmentCard = ({ attachment }) => (
  <Card className="mb-4">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">{attachment.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{attachment.location}</p>
      <p className="text-sm line-clamp-3">{attachment.description}</p>
    </CardBody>
    <CardFooter>
      <Link href={`/company-dashboard/attachments/${attachment._id}`}>
        <Button color="primary">Manage Attachment</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function Attachments() {
  const { data: session } = useSession();
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchAttachments = async () => {
      if (session?.user?.email) {
        const response = await fetch(`/api/attachments?companyEmail=${session.user.email}`);
        const data = await response.json();
        setAttachments(data);
      }
    };

    fetchAttachments();
  }, [session]);

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">All Attachments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map(attachment => (
          <AttachmentCard key={attachment._id} attachment={attachment} />
        ))}
      </div>
      <div className="mt-8">
        <Link href="/company-dashboard/post-attachment">
          <Button color="success">Post New Attachment</Button>
        </Link>
      </div>
    </Container>
  );
}