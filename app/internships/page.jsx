'use client'

import { useState } from 'react';
import { Input, Button, Card, CardBody, CardFooter } from "@nextui-org/react";

const InternshipCard = ({ company, position, location, description }) => (
  <Card className="mb-4">
    <CardBody>
      <h3 className="text-lg font-semibold">{position}</h3>
      <p className="text-sm text-gray-500">{company} - {location}</p>
      <p className="mt-2">{description}</p>
    </CardBody>
    <CardFooter>
      <Button color="primary">Apply Now</Button>
    </CardFooter>
  </Card>
);

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const internships = [
    { company: "Facebook", position: "Software Engineer Intern", location: "Nairobi", description: "Join our team to work on cutting-edge technologies..." },
    { company: "Google", position: "Product Design Intern", location: "Mombasa", description: "Help design the next generation of Google products..." },
    { company: "Microsoft", position: "Data Science Intern", location: "Kisumu", description: "Work with big data and machine learning models..." },
    // Add more internship listings as needed
  ];

  const filteredInternships = internships.filter(internship =>
    internship.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Internships</h1>
      <Input
        placeholder="Search internships..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8"
      />
      {filteredInternships.map((internship, index) => (
        <InternshipCard key={index} {...internship} />
      ))}
    </div>
  );
}