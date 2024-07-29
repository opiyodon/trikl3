'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react'; // Add authentication

const ApplicationCard = ({ application, updateStatus }) => (
  <Card className="mb-4 h-[200px] flex flex-col">
    <CardBody className="flex-grow overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">{application.studentName}</h3>
      <p className="text-sm text-gray-500 mb-2">{application.email}</p>
      <p className="text-sm line-clamp-4">{application.message}</p>
      <p className="text-sm font-semibold">Status: {application.status}</p>
    </CardBody>
    <CardFooter>
      <Button onClick={() => updateStatus(application._id, 'Accepted')} className="mr-2">Accept</Button>
      <Button onClick={() => updateStatus(application._id, 'Rejected')} color="error">Reject</Button>
    </CardFooter>
  </Card>
);

export default function Dashboard() {
  const { data: session } = useSession(); // Add authentication session
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await fetch(`/api/applications?companyName=${session?.user?.name}`);
      const data = await response.json();
      setApplications(data);
    };

    if (session) {
      fetchApplications();
    }
  }, [session]);

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setApplications(prevApplications => prevApplications.map(app => 
          app._id === applicationId ? { ...app, status } : app
        ));
      } else {
        console.error('Failed to update application status.');
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map(application => (
          <ApplicationCard key={application._id} application={application} updateStatus={updateStatus} />
        ))}
      </div>
    </Container>
  );
}
