'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Input, Textarea, Button } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react'; // Add authentication

export default function ApplyPage() {
  const { data: session } = useSession(); // Add authentication session
  const [attachment, setAttachment] = useState(null);
  const [application, setApplication] = useState({
    studentName: session?.user?.name || '',
    email: session?.user?.email || '',
    message: ''
  });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchAttachment = async () => {
      const response = await fetch(`/api/attachments/${id}`);
      const data = await response.json();
      setAttachment(data);
    };

    if (id) {
      fetchAttachment();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/attachments/apply/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(application)
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        router.push('/attachments');
      } else {
        alert('Failed to submit application.');
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application.');
    }
  };

  if (!attachment) {
    return <Container><FuturisticLoader /></Container>;
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Apply for {attachment.position}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <Input
          label="Name"
          name="studentName"
          value={application.studentName}
          onChange={handleChange}
          className="mb-4"
          disabled // Disable input if name is pre-filled
        />
        <Input
          label="Email"
          name="email"
          value={application.email}
          onChange={handleChange}
          className="mb-4"
          disabled // Disable input if email is pre-filled
        />
        <Textarea
          label="Message"
          name="message"
          value={application.message}
          onChange={handleChange}
          className="mb-4"
        />
        <Button type="submit" color="primary">
          Submit Application
        </Button>
      </form>
    </Container>
  );
}
