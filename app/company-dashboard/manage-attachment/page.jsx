'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageAttachment() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    const fetchAttachment = async () => {
      // Ensure id and session are defined before fetching
      if (id && session?.user?.email) {
        try {
          const response = await fetch(`/api/attachments/${id}?companyEmail=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setAttachment(data);
          } else {
            toast.error('Failed to fetch attachment data.');
          }
        } catch (error) {
          toast.error('Error fetching attachment data.');
        }
      }
    };

    // Only fetch when both id and session are available
    if (id && session) {
      fetchAttachment();
    }
  }, [id, session]);

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

  if (!attachment) return <div>Loading...</div>;

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
