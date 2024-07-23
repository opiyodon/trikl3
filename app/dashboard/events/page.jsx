import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";

const EventCard = ({ title, date, location, description }) => (
  <Card className="mb-4">
    <CardBody>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{date} - {location}</p>
      <p className="mt-2">{description}</p>
    </CardBody>
    <CardFooter>
      <Button color="primary">Register</Button>
    </CardFooter>
  </Card>
);

export default function EventsPage() {
  const events = [
    {
      title: "Tech Career Fair",
      date: "July 15, 2024",
      location: "Nairobi",
      description: "Connect with top tech companies and explore internship opportunities."
    },
    {
      title: "Web Development Workshop",
      date: "August 5, 2024",
      location: "Online",
      description: "Learn the latest web development technologies from industry experts."
    },
    {
      title: "AI and Machine Learning Symposium",
      date: "September 20, 2024",
      location: "Mombasa",
      description: "Explore the future of AI and machine learning in various industries."
    },
    // Add more events as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      {events.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </div>
  );
}