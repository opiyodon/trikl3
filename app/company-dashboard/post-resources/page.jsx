'use client'

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostResource() {
  const router = useRouter();
  const { data: session } = useSession();
  const [resource, setResource] = useState({
    title: '',
    description: '',
    type: '',
    link: '',
    tags: ''
  });

  const resourceTypes = [
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'course', label: 'Online Course' },
    { value: 'tool', label: 'Software Tool' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resource,
          companyEmail: session?.user?.email,
          companyName: session?.user?.name,
          createdAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success('Resource posted successfully');
        router.push('/company-dashboard');
      } else {
        toast.error('Failed to post resource');
      }
    } catch (error) {
      toast.error('Failed to post resource');
      console.error('Error posting resource:', error);
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Post New Resource</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={resource.title}
              onChange={(e) => setResource({...resource, title: e.target.value})}
              className="mb-4"
            />
            <Textarea
              label="Description"
              value={resource.description}
              onChange={(e) => setResource({...resource, description: e.target.value})}
              className="mb-4"
            />
            <Select
              label="Resource Type"
              value={resource.type}
              onChange={(e) => setResource({...resource, type: e.target.value})}
              className="mb-4"
            >
              {resourceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Link to Resource"
              value={resource.link}
              onChange={(e) => setResource({...resource, link: e.target.value})}
              className="mb-4"
            />
            <Input
              label="Tags (comma-separated)"
              value={resource.tags}
              onChange={(e) => setResource({...resource, tags: e.target.value})}
              className="mb-4"
              placeholder="e.g., programming, career advice, industry insights"
            />
            <Button color="primary" type="submit">Post Resource</Button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}