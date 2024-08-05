'use client';

import { useState, useEffect } from 'react';
import { Button, Progress, Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import Activity from "./Activity";
import Recommended from "./Recommended";
import Container from "./pageLayout/Container";
import FuturisticLoader from "./FuturisticLoader";
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/students?email=${session.user.email}`);
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
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
        <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.fullName || 'User'}!</h1>
        <p className="mb-8">
          Let's continue your journey to find the perfect tech internship.
        </p>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Profile Completion</h2>
          </CardHeader>
          <CardBody>
            <Progress color="secondary" value={user?.profileStrength || 0} className="mb-4" />
            <p>{user?.profileStrength || 0}% complete</p>
            <Button as={Link} href="/student-dashboard/account" className="btnPri mt-4 w-fit">
              {user?.profileStrength === 100 ? 'View your profile' : 'Complete your profile'}
            </Button>
          </CardBody>
        </Card>
      </div>
      <Activity userEmail={user?.email} />
      <Recommended userProfile={user} />
    </Container>
  );
};

export default Dashboard;