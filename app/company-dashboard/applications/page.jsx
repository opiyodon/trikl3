'use client'

import { useEffect, useState, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '@/components/FuturisticLoader';
import ApplicationCard from '@/components/company/ApplicationCard';

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/applications?email=${session?.user?.email}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchApplications();
    }
  }, [session, fetchApplications]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setApplications(applications.filter(app => app._id !== id));
        toast.success('Application deleted successfully.');
      } else {
        toast.error('Failed to delete application. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    onOpen();
  };

  if (isLoading) {
    return (
      <Container>
        <FuturisticLoader />
      </Container>
    );
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Your Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map(application => (
          <ApplicationCard
            key={application._id}
            application={application}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      {applications.length === 0 && (
        <p className="text-center text-gray-500 mt-8">You haven&apos;t submitted any applications yet.</p>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        className="h-[90vh] max-w-4xl mx-auto mt-[5vh]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{selectedApplication?.jobDetails.title}</h2>
                <p className="text-lg">{selectedApplication?.jobDetails.company}</p>
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                <article className="prose max-w-none">
                  <section>
                    <h3 className="text-xl font-semibold mb-2">Application Details</h3>
                    <p><strong>Location:</strong> {selectedApplication?.jobDetails.location}</p>
                    <p><strong>Status:</strong> {selectedApplication?.status}</p>
                    <p><strong>Applied on:</strong> {new Date(selectedApplication?.createdAt).toLocaleDateString()}</p>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Resume</h3>
                    {selectedApplication?.resume && (
                      <embed src={selectedApplication.resume} type="application/pdf" width="100%" height="400px" className="border rounded" />
                    )}
                  </section>

                  {selectedApplication?.coverLetter && (
                    <section className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
                      <embed src={selectedApplication.coverLetter} type="application/pdf" width="100%" height="400px" className="border rounded" />
                    </section>
                  )}
                </article>
              </ModalBody>
              <ModalFooter>
                <Button className="w-full btnPri" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}