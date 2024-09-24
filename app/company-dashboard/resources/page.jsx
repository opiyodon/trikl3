'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button, Divider } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '@/components/FuturisticLoader';

const ResourcesCard = ({ resource }) => (
  <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
    <CardBody>
      <h3 className="text-xl font-semibold mb-2">{resource.position}</h3>
      <p className="text-sm text-gray-500 mb-2">{resource.companyName} - {resource.location}</p>
      <Divider className="my-3" />
      <p className="text-sm line-clamp-3">{resource.description}</p>
    </CardBody>
    <CardFooter className="flex justify-between">
      <p className="text-sm">Duration: {resource.duration} weeks</p>
      <Link href={`/company-dashboard/resources/${resource._id}`}>
        <Button color="primary" size="sm">Manage</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function CompanyResources() {
  const { data: session, status } = useSession();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/resources?companyEmail=${encodeURIComponent(session.user.email)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch resources');
          }
          const data = await response.json();
          setResources(data);
        } catch (error) {
          console.error('Error fetching resources:', error);
          toast.error('Failed to load resources. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchResources();
    }
  }, [session, status]);

  if (status === 'loading' || isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Resources</h1>
        <Link href="/company-dashboard/post-resources">
          <Button color="success" size="lg">Post New Resource</Button>
        </Link>
      </div>
      {resources.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">You haven't posted any resources yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <ResourcesCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </Container>
  );
}