'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageAttachmentForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttachment = async () => {
      const id = new URLSearchParams(window.location.search).get('id');
      if (id && session?.user?.email) {
        try {
          const response = await fetch(`/api/attachments/${id}?companyEmail=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setAttachment(data);
            setIsLoading(false);
          } else {
            toast.error('Failed to fetch attachment data.');
            setIsLoading(false);
          }
        } catch (error) {
          toast.error('Error fetching attachment data.');
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchAttachment();
    }
  }, [session, status]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/attachments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attachment)
      });

      if (response.ok) {
        toast.success('Attachment updated successfully');
      } else {
        toast.error('Failed to update attachment');
      }
    } catch (error) {
      toast.error('Error updating attachment');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this attachment?')) {
      try {
        const response = await fetch(`/api/attachments/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          toast.success('Attachment deleted successfully');
          router.push('/company-dashboard/attachments');
        } else {
          toast.error('Failed to delete attachment');
        }
      } catch (error) {
        toast.error('Error deleting attachment');
      }
    }
  };

  if (status === 'loading' || isLoading) return <div>Loading...</div>;

  if (!attachment) return <div>No attachment found</div>;

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Manage Attachment</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleUpdate}>
            <Input
              label="Title"
              value={attachment.title}
              onChange={(e) => setAttachment({ ...attachment, title: e.target.value })}
              className="mb-4"
            />
            <Input
              label="Location"
              value={attachment.location}
              onChange={(e) => setAttachment({ ...attachment, location: e.target.value })}
              className="mb-4"
            />
            <Textarea
              label="Description"
              value={attachment.description}
              onChange={(e) => setAttachment({ ...attachment, description: e.target.value })}
              className="mb-4"
            />
            <div className="flex justify-between">
              <Button color="primary" type="submit">Update Attachment</Button>
              <Button color="danger" onClick={handleDelete}>Delete Attachment</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}