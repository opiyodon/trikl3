'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '../FuturisticLoader';
import ConfirmationDialog from './ConfirmationDialog';

export default function ManageResourceForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      const id = new URLSearchParams(window.location.search).get('id');
      if (id && session?.user?.email) {
        try {
          const response = await fetch(`/api/resources/${id}?companyEmail=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setResource(data);
            setIsLoading(false);
          } else {
            toast.error('Failed to fetch resource data.');
            setIsLoading(false);
          }
        } catch (error) {
          toast.error('Error fetching resource data.');
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchResource();
    }
  }, [session, status]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/resources/${resource._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
      });

      if (response.ok) {
        toast.success('Resource updated successfully');
        router.push('/company-dashboard/resources');
      } else {
        toast.error('Failed to update resource');
      }
    } catch (error) {
      toast.error('Error updating resource');
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/resources/${resource._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Resource deleted successfully');
        router.push('/company-dashboard/resources');
      } else {
        toast.error('Failed to delete resource');
      }
    } catch (error) {
      toast.error('Error deleting resource');
    }
    setIsDeleteDialogOpen(false);
  };

  if (status === 'loading' || isLoading) return <FuturisticLoader />;

  if (!resource) return <div>No resource found</div>;

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Manage Resource</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleUpdate}>
            <Input
              label="Company Name"
              value={resource.companyName}
              onChange={(e) => setResource({ ...resource, companyName: e.target.value })}
              className="mb-4"
            />
            <Input
              label="Position"
              value={resource.position}
              onChange={(e) => setResource({ ...resource, position: e.target.value })}
              className="mb-4"
            />
            <Input
              label="Location"
              value={resource.location}
              onChange={(e) => setResource({ ...resource, location: e.target.value })}
              className="mb-4"
            />
            <Textarea
              label="Description"
              value={resource.description}
              onChange={(e) => setResource({ ...resource, description: e.target.value })}
              className="mb-4"
            />
            <Input
              label="Duration (in weeks)"
              type="number"
              value={resource.duration}
              onChange={(e) => setResource({ ...resource, duration: e.target.value })}
              className="mb-4"
            />
            <div className="flex justify-between">
              <Button color="primary" type="submit">Update Resource</Button>
              <Button color="danger" onClick={handleDeleteClick}>Delete Resource</Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this resource?"
      />
    </Container>
  );
}
