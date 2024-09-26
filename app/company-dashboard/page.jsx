'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '@/components/FuturisticLoader';
import Container from '@/components/pageLayout/Container';

const ApplicationCard = ({ application }) => (
  <Card className="mb-4">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">{application.studentName}</h3>
      <p className="mb-2">Position: {application.jobDetails.title}</p>
      <p className="mb-2">Status: {application.status}</p>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  const { data: session } = useSession();
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        try {
          const [companyResponse, applicationsResponse, attachmentsResponse] = await Promise.all([
            fetch(`/api/companies?email=${session.user.email}`),
            fetch(`/api/applications?companyName=${encodeURIComponent(session.user.name)}`),
            fetch(`/api/attachments?companyEmail=${session.user.email}`)
          ]);

          const companyData = await companyResponse.json();
          const applicationsData = await applicationsResponse.json();
          const attachmentsData = await attachmentsResponse.json();

          setCompany(companyData);
          setApplications(applicationsData);
          setAttachments(attachmentsData);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          toast.error('Failed to load dashboard data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  if (isLoading) {
    return (
      <Container>
        <FuturisticLoader />
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-12">
        <ToastContainer position="top-right" autoClose={5000} />
        <h1 className="text-4xl font-bold mb-4">Welcome back, {company?.companyName || 'Company'}!</h1>
        <p className="mb-8">
          Let&apos;s manage your internships and find great talent.
        </p>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Profile Completion</h2>
          </CardHeader>
          <CardBody>
            <Progress color="secondary" value={company?.profileStrength || 0} className="mb-4" />
            <p>{company?.profileStrength || 0}% complete</p>
            <Button as={Link} href="/company-dashboard/account" className="btnPri mt-4 w-fit">
              {company?.profileStrength === 100 ? 'View your profile' : 'Complete your profile'}
            </Button>
          </CardBody>
        </Card>

        <div className="mb-12 mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.slice(0, 6).map(application => (
              <ApplicationCard key={application._id} application={application} />
            ))}
          </div>
          {applications.length > 6 && (
            <div className="mt-6 text-center">
              <Button as={Link} href="/company-dashboard/applications" color="primary">
                View All Applications
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Company Stats</h2>
          </CardHeader>
          <CardBody>
            <p>Active Attachments: {attachments.length}</p>
            <p>Total Applications: {applications.length}</p>
            <p>Pending Review: {applications.filter(app => app.status === 'Pending').length}</p>
            <p>Accepted Applications: {applications.filter(app => app.status === 'Accepted').length}</p>
            <p>Rejected Applications: {applications.filter(app => app.status === 'Denied').length}</p>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export default Dashboard;