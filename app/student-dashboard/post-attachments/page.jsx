'use client'

import { useState } from 'react';
import { Input, Textarea, Button, Select, SelectItem } from "@nextui-org/react";
import { useSession } from 'next-auth/react'; // Add authentication

export default function PostInternshipPage() {
  const { data: session } = useSession(); // Add authentication session
  const [formData, setFormData] = useState({
    companyName: session?.user?.name || '', // Use authenticated user's company name if available
    position: '',
    location: '',
    description: '',
    requirements: '',
    duration: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/attachments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Internship posted successfully!');
      } else {
        alert('Failed to post internship.');
      }
    } catch (error) {
      console.error('Failed to post internship:', error);
      alert('Failed to post internship.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Post an Internship</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <Input
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="mb-4"
          disabled // Disable input if company name is pre-filled
        />
        <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mb-4"
        />
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mb-4"
        />
        <Textarea
          label="Requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          className="mb-4"
        />
        <Select
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="mb-4"
        >
          <SelectItem value="3 months">3 months</SelectItem>
          <SelectItem value="6 months">6 months</SelectItem>
          <SelectItem value="12 months">12 months</SelectItem>
        </Select>
        <Button type="submit" color="primary">
          Post Internship
        </Button>
      </form>
    </div>
  );
}
