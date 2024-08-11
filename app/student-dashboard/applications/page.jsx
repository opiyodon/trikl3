'use client'

import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '@/components/FuturisticLoader';

const ApplicationCard = ({ application, onDelete, onViewDetails }) => (
  <Card className="mb-4">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">{application.jobDetails.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{application.jobDetails.company} - {application.jobDetails.location}</p>
      <p className="text-sm mb-2">Status: {application.status}</p>
      <p className="text-sm mb-2">Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
    </CardBody>
    <CardFooter>
      <Button color="primary" onClick={() => onViewDetails(application)} className="mr-2">View Details</Button>
      <Button color="danger" onClick={() => onDelete(application._id)}>Delete</Button>
    </CardFooter>
  </Card>
);

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
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
    };

    if (session) {
      fetchApplications();
    }
  }, [session]);

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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  if (isLoading) {
    return <FuturisticLoader />;
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
        <p className="text-center text-gray-500 mt-8">You haven't submitted any applications yet.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Application Details</ModalHeader>
              <ModalBody>
                {selectedApplication && (
                  <>
                    <h2 className="text-xl font-semibold">{selectedApplication.jobDetails.title}</h2>
                    <p>{selectedApplication.jobDetails.company} - {selectedApplication.jobDetails.location}</p>
                    <p>Status: {selectedApplication.status}</p>
                    <p>Applied on: {new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                    <h3 className="text-lg font-semibold mt-4">Resume</h3>
                    {selectedApplication.resume && (
                      <embed src={selectedApplication.resume} type="application/pdf" width="100%" height="300px" />
                    )}
                    {selectedApplication.coverLetter && (
                      <>
                        <h3 className="text-lg font-semibold mt-4">Cover Letter</h3>
                        <embed src={selectedApplication.coverLetter} type="application/pdf" width="100%" height="300px" />
                      </>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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