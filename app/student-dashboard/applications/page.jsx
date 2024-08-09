'use client'

import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react'; // Add authentication

const ApplicationCard = ({ application }) => (
  <Card className="mb-4 h-[200px] flex flex-col">
    <CardBody className="flex-grow overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">{application.attachment.position}</h3>
      <p className="text-sm text-gray-500 mb-2">{application.attachment.companyName}</p>
      <p className="text-sm line-clamp-4">{application.message}</p>
      <p className="text-sm font-semibold">Status: {application.status}</p>
    </CardBody>
  </Card>
);

export default function ApplicationsPage() {
  const { data: session } = useSession(); // Add authentication session
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await fetch(`/api/applications?email=${session?.user?.email}`);
      const data = await response.json();
      setApplications(data);
    };

    if (session) {
      fetchApplications();
    }
  }, [session]);

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Your Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map(application => (
          <ApplicationCard key={application._id} application={application} />
        ))}
      </div>
    </Container>
  );
}
