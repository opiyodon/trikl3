import { Button } from "@nextui-org/react";
import Link from "next/link";

const ActivityCard = ({ title, description, buttonText, buttonLink }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="mb-4">{description}</p>
    <Button as={Link} href={buttonLink} color="primary">
      {buttonText}
    </Button>
  </div>
);

const RecommendedCard = ({ company, position, logo }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <img src={logo} alt={`${company} logo`} className="w-full h-40 object-cover rounded-md mb-4" />
    <h4 className="font-semibold">{position}</h4>
    <p className="text-sm text-gray-500">{company}</p>
  </div>
);

export default function Home() {
  const recommendations = [
    { company: "Facebook", position: "Software Engineer Intern", logo: "/images/facebook-logo.png" },
    { company: "Google", position: "Product Design Intern", logo: "/images/google-logo.png" },
    { company: "Netflix", position: "Data Analyst Intern", logo: "/images/netflix-logo.png" },
    { company: "Apple", position: "Software Engineer Intern", logo: "/images/apple-logo.png" },
    { company: "Amazon", position: "Product Design Intern", logo: "/images/amazon-logo.png" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Mara Labs</h1>
        <p className="max-w-2xl mx-auto mb-8">
          Mara Labs is a platform that connects Kenyan tech students with internship opportunities at leading tech companies. Our AI-driven matching algorithm helps you find internships that are right for you.
        </p>
        <Button as={Link} href="/register" color="primary" size="lg">
          Get started
        </Button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Your activity</h2>
        <ActivityCard
          title="Complete your profile"
          description="Add more information to get better matches"
          buttonText="Complete profile"
          buttonLink="/account"
        />
        <ActivityCard
          title="Apply to internships"
          description="Start applying to internships"
          buttonText="View internships"
          buttonLink="/internships"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recommendations.map((rec, index) => (
            <RecommendedCard key={index} {...rec} />
          ))}
        </div>
      </div>
    </div>
  );
}