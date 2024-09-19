'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Account() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        const response = await fetch(`/api/companies?email=${session.user.email}`);
        const data = await response.json();
        setProfile(data);
      }
    };

    fetchProfile();
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Edit Company Profile</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleUpdate}>
            <Input
              label="Company Name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Industry"
              value={profile.industry}
              onChange={(e) => setProfile({...profile, industry: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Location"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              className="mb-4"
            />
            <Textarea
              label="Company Description"
              value={profile.description}
              onChange={(e) => setProfile({...profile, description: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Website"
              value={profile.website}
              onChange={(e) => setProfile({...profile, website: e.target.value})}
              className="mb-4"
            />
            <Button color="primary" type="submit">Update Profile</Button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}