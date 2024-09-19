'use client'

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostAttachment() {
  const router = useRouter();
  const { data: session } = useSession();
  const [attachment, setAttachment] = useState({
    title: '',
    location: '',
    description: '',
    requirements: '',
    duration: '',
    startDate: '',
    stipend: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/attachments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...attachment,
          companyEmail: session?.user?.email
        })
      });

      if (response.ok) {
        toast.success('Attachment posted successfully');
        router.push('/company-dashboard/attachments');
      } else {
        toast.error('Failed to post attachment');
      }
    } catch (error) {
      toast.error('Failed to post attachment');
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Post New Attachment</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={attachment.title}
              onChange={(e) => setAttachment({...attachment, title: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Location"
              value={attachment.location}
              onChange={(e) => setAttachment({...attachment, location: e.target.value})}
              className="mb-4"
            />
            <Textarea
              label="Description"
              value={attachment.description}
              onChange={(e) => setAttachment({...attachment, description: e.target.value})}
              className="mb-4"
            />
            <Textarea
              label="Requirements"
              value={attachment.requirements}
              onChange={(e) => setAttachment({...attachment, requirements: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Duration (in weeks)"
              type="number"
              value={attachment.duration}
              onChange={(e) => setAttachment({...attachment, duration: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Start Date"
              type="date"
              value={attachment.startDate}
              onChange={(e) => setAttachment({...attachment, startDate: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Stipend (optional)"
              value={attachment.stipend}
              onChange={(e) => setAttachment({...attachment, stipend: e.target.value})}
              className="mb-4"
            />
            <Button color="primary" type="submit">Post Attachment</Button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}