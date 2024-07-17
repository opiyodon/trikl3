'use client';

import { useState, useEffect } from 'react';
import { Button, Link, Progress } from "@nextui-org/react";
import Activity from "./Activity";
import Recommended from "./Recommended";
import Container from "./pageLayout/Container";
import FuturisticLoader from "./FuturisticLoader";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch user data
    setTimeout(() => {
      setUser({
        name: "Don Artkins",
        email: "donartkins@gmail.com",
        profileCompletion: 70,
        recentActivity: [
          { type: "application", company: "Tech Corp", date: "2024-07-08" },
          { type: "profile_update", field: "skills", date: "2024-07-07" },
        ],
      });
      setIsLoading(false);
    }, 1500);
  }, []);

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
        <h1 className="text-4xl font-bold mb-4">Welcome back, {user.name}!</h1>
        <p className="mb-8">
          Let's continue your journey to find the perfect tech internship.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Profile Completion</h2>
          <Progress value={user.profileCompletion} className="mb-4" />
          <p>{user.profileCompletion}% complete</p>
          <Button as={Link} href="/account" className="btnPri mt-4">
            Complete your profile
          </Button>
        </div>
      </div>
      <Activity recentActivity={user.recentActivity} />
      <Recommended userProfile={user} />
    </Container>
  );
};

export default Dashboard;