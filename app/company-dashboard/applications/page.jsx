'use client'

import { useEffect, useState, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Card, CardBody, Select, SelectItem } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '@/components/FuturisticLoader';
import ApplicationCard from '@/components/ApplicationCard';

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/applications?companyName=${encodeURIComponent(session?.user?.name)}`);
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) {
        setApplications(applications.map(app =>
          app._id === id ? { ...app, status: newStatus } : app
        ));
        toast.success('Application status updated successfully.');
      } else {
        toast.error('Failed to update application status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
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
      <h1 className="text-3xl font-bold mb-8">Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map(application => (
          <ApplicationCard
            key={application._id}
            application={{
              ...application,
              jobDetails: {
                ...application.jobDetails,
                company: application.studentName // Use studentName as company for display
              }
            }}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            isCompanyView={true} // Add this prop to indicate company view
          />
        ))}
      </div>
      {applications.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No applications found.</p>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        className="h-[90vh] max-w-4xl mx-4 my-10 md:mx-auto md:mt-[5vh]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{selectedApplication?.jobDetails.title}</h2>
                <p className="text-lg">{selectedApplication?.studentName}</p>
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                <article className="prose max-w-none">
                  <section>
                    <h3 className="text-xl font-semibold mb-2">Application Details</h3>
                    <p><strong>Status:</strong> {selectedApplication?.status}</p>
                    <p><strong>Applied on:</strong> {new Date(selectedApplication?.createdAt).toLocaleDateString()}</p>
                    <Select
                      label="Application Status"
                      placeholder="Select status"
                      className="max-w-xs mt-3"
                      value={selectedApplication?.status}
                      onChange={(e) => handleStatusChange(selectedApplication?._id, e.target.value)}
                    >
                      <SelectItem key="Pending" value="Pending">
                        Pending
                      </SelectItem>
                      <SelectItem key="Under Review" value="Under Review">
                        Under Review
                      </SelectItem>
                      <SelectItem key="Accepted" value="Accepted">
                        Accepted
                      </SelectItem>
                      <SelectItem key="Denied" value="Denied">
                        Denied
                      </SelectItem>
                    </Select>
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
                <Button color="danger" onPress={() => { handleDelete(selectedApplication._id); onClose(); }}>
                  Delete Application
                </Button>
                <Button className="btnPri" onPress={onClose}>
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