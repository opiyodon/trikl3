'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplicationCard from '@/components/company/ApplicationCard';

export default function Dashboard() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        const [applicationsResponse, profileResponse] = await Promise.all([
          fetch(`/api/applications?companyEmail=${session.user.email}`),
          fetch(`/api/companies?email=${session.user.email}`)
        ]);

        const applicationsData = await applicationsResponse.json();
        const profileData = await profileResponse.json();

        setApplications(applicationsData);
        setCompanyProfile(profileData);
      }
    };

    fetchData();
  }, [session]);

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setApplications(prevApplications => prevApplications.map(app =>
          app._id === applicationId ? { ...app, status } : app
        ));
        toast.success(`Application status updated to ${status}`);
      } else {
        toast.error('Failed to update application status.');
      }
    } catch (error) {
      toast.error('Failed to update application status.');
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Company Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Company Profile</h2>
            <p>Name: {companyProfile?.name || 'Not set'}</p>
            <p>Email: {companyProfile?.email || 'Not set'}</p>
            <p>Industry: {companyProfile?.industry || 'Not set'}</p>
          </CardBody>
          <CardFooter>
            <Link href="/company-dashboard/account">
              <Button color="primary">Edit Profile</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link href="/company-dashboard/post-attachment">
                <Button color="success" className="w-full">Post New Attachment</Button>
              </Link>
              <Link href="/company-dashboard/attachments">
                <Button color="secondary" className="w-full">View All Attachments</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recent Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.slice(0, 6).map(application => (
          <ApplicationCard key={application._id} application={application} updateStatus={updateStatus} />
        ))}
      </div>
      {applications.length > 6 && (
        <div className="mt-4 text-center">
          <Link href="/company-dashboard/applications">
            <Button color="primary">View All Applications</Button>
          </Link>
        </div>
      )}
    </Container>
  );
}