import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";

const ResourceCard = ({ title, description, link }) => (
  <Card className="mb-4">
    <CardBody>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{description}</p>
    </CardBody>
    <CardFooter>
      <Button as="a" href={link} target="_blank" rel="noopener noreferrer">
        Learn More
      </Button>
    </CardFooter>
  </Card>
);

export default function ResourcesPage() {
  const resources = [
    {
      title: "Resume Writing Guide",
      description: "Learn how to create a standout resume for tech internships.",
      link: "#"
    },
    {
      title: "Interview Preparation",
      description: "Tips and tricks for acing your internship interviews.",
      link: "#"
    },
    {
      title: "Tech Skills Roadmap",
      description: "A guide to essential skills for various tech roles.",
      link: "#"
    },
    // Add more resources as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Resources</h1>
      {resources.map((resource, index) => (
        <ResourceCard key={index} {...resource} />
      ))}
    </div>
  );
}